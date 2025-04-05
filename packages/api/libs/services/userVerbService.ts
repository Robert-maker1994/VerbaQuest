import { AppDataSource } from "../../datasource";
import { Verb } from "../entity";
import { UserVerbGroup, VerbGroup } from "../entity/verbs/userVerb";
import { CustomError } from "../errors/customError";

class UserVerbServiceError extends CustomError {}

export const userVerbService = {
  async getAll(userId: number) {
    try {
      const userVerbGroupRepo = AppDataSource.getRepository(VerbGroup);

      const userVerbGroups = await userVerbGroupRepo.find({
        where: {
          user: {
            user_id: userId,
          },
        },
        relations: {
          userVerbGroups: {
            verb: {
              word: true,
            },
          },
        },
        select: {
          group_id: true,
          group_name: true,
          created_at: true,
          userVerbGroups: {
            user_verb_group_id: true,
            verb: {
              verb_id: true,
              word: {
                word_text: true,
              },
            },
          },
        },
      });

      return userVerbGroups;
    } catch (err) {
      console.error("error throw in getAll userVerbService", err);
      throw new UserVerbServiceError("Error getting UserVerbGroup", 500);
    }
  },

  async update(userId: number, verbIds: number[], groupId: number, title: string) {
    try {
      const verbGroupRepo = AppDataSource.getRepository(VerbGroup);
      const userVerbGroupRepo = AppDataSource.getRepository(UserVerbGroup);
      const verbRepo = AppDataSource.getRepository(Verb);

      const group = await verbGroupRepo.findOne({
        where: {
          user: {
            user_id: userId,
          },
          group_id: groupId,
        },
        relations: {
          userVerbGroups: true,
        },
      });

      if (!group) {
        throw new UserVerbServiceError("Group not found", 404);
      }

      group.group_name = title;
      await verbGroupRepo.save(group);

      await userVerbGroupRepo.delete({ group: { group_id: groupId } });

      const verbs = await verbRepo.find({
        where: verbIds.map((id) => ({ verb_id: id })),
      });

      if (verbs.length !== verbIds.length) {
        throw new UserVerbServiceError("Verbs not found", 404);
      }

      const userVerbs = verbs.map((verb) => {
        return userVerbGroupRepo.create({
          group,
          verb,
        });
      });

      await userVerbGroupRepo.save(userVerbs);

      return group;
    } catch (err) {
      console.error("error throw in update userVerbService", err);
      if (err instanceof UserVerbServiceError) {
        throw err;
      }
      throw new UserVerbServiceError("Error updating UserVerbGroup", 500);
    }
  },

  async create(userId: number, verbId: number[], title: string) {
    try {
      const verbGroupRepo = AppDataSource.getRepository(VerbGroup);
      const userVerbRepo = AppDataSource.getRepository(UserVerbGroup);
      const verbRepo = AppDataSource.getRepository(Verb);

      const existingGroup = await verbGroupRepo.findOne({
        where: {
          user: {
            user_id: userId,
          },
          group_name: title,
        },
      });

      if (existingGroup) {
        throw new UserVerbServiceError("Group already exists", 409);
      }

      const verbs = await verbRepo.find({
        where: verbId.map((id) => ({ verb_id: id })),
      });

      if (verbs.length !== verbId.length) {
        throw new UserVerbServiceError("Verbs not found", 404);
      }

      const group = verbGroupRepo.create({
        user: { user_id: userId },
        group_name: title,
      });

      const savedGroup = await verbGroupRepo.save(group);

      const userVerbs = verbs.map((verb) => {
        return userVerbRepo.create({
          group: savedGroup,
          verb,
        });
      });
      await userVerbRepo.save(userVerbs);

      return savedGroup;
    } catch (err) {
      console.error("error throw in create userVerbService", err);
      if (err instanceof UserVerbServiceError) {
        throw err;
      }
      throw new UserVerbServiceError("Error creating UserVerbGroup", 500);
    }
  },

  async delete(user_id: number, group_id: number) {
    try {
      const deleted = await AppDataSource.manager.delete(VerbGroup, {
        user: { user_id },
        group_id,
      });

      if (deleted.affected === 0) {
        throw new UserVerbServiceError("Group not found", 404);
      }

      return deleted;
    } catch (err) {
      console.error("error throw in delete userVerbService", err);
      if (err instanceof UserVerbServiceError) {
        throw err;
      }
      throw new UserVerbServiceError("Error deleting UserVerbGroup", 500);
    }
  },
};

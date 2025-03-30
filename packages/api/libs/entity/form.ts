import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Languages } from "./language";

@Entity()
export class Form {
    @PrimaryGeneratedColumn({ comment: "The unique identifier for this form." })
    form_id: number;

    @ManyToOne(() => Languages, { onDelete: "CASCADE" })
    @JoinColumn({ name: "language_id" })
    language: Languages;

    @Column({
        type: "varchar",
        length: 50,
        comment: "The grammatical form (e.g., yo, tú, él/ella/usted).",
    })
    form: string;
}

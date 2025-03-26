import type React from "react";
import { Container, Typography, Box, Link } from "@mui/material";

const TermsOfService: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Terms of Service
        </Typography>

        <Typography>
          Welcome to VerbaQuest! These Terms of Service ("Terms") govern your
          access to and use of our language learning application (the "App"). By
          accessing or using the App, you agree to be bound by these Terms.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Use of the App
        </Typography>
        <Typography>
          You may use the App only for lawful purposes and in accordance with
          these Terms. You agree not to use the App:
        </Typography>
        <ul>
          <li>In any way that violates any applicable law or regulation.</li>
          <li>To transmit any unsolicited or unauthorized advertising.</li>
          <li>To impersonate or attempt to impersonate VerbaQuest or another user.</li>
          <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the App.</li>
        </ul>

        <Typography variant="h6" gutterBottom>
          User Accounts
        </Typography>
        <Typography >
          You may be required to create an account to access certain features of
          the App. You are responsible for maintaining the confidentiality of
          your account credentials and for all activities that occur under your
          account.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Intellectual Property
        </Typography>
        <Typography >
          The App and its entire contents, features, and functionality (including
          but not limited to all information, software, text, displays, images,
          video, and audio) are owned by VerbaQuest and are protected by
          copyright, trademark, and other intellectual property laws.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Disclaimer of Warranties
        </Typography>
        <Typography >
          The App is provided on an "as is" and "as available" basis, without
          any warranties of any kind, either express or implied.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Limitation of Liability
        </Typography>
        <Typography >
          In no event will VerbaQuest be liable for any damages arising out of or
          in connection with your use of the App.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Governing Law
        </Typography>
        <Typography >
          These Terms shall be governed and construed in accordance with the laws
          of [Your Jurisdiction], without regard to its conflict of law
          provisions.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Changes to These Terms
        </Typography>
        <Typography >
          We may update these Terms from time to time. We will notify you of any
          changes by posting the new Terms on this page.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Contact Us
        </Typography>
        <Typography >
          If you have any questions about these Terms, please contact us at{" "}
          <Link href="mailto:support@verbaquest.com">support@verbaquest.com</Link>.
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsOfService;

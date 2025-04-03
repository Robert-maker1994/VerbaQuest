import { Box, Container, Link, Typography } from "@mui/material";
import type React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Privacy Policy
        </Typography>

        <Typography>
          VerbaQuest ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you use our language learning application (the
          "App"). Please read this Privacy Policy carefully.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Information We Collect
        </Typography>
        <Typography>We may collect the following types of information:</Typography>
        <Typography>
          <strong>Personal Information:</strong> When you create an account, we may collect your name, email address,
          and password.
        </Typography>
        <Typography>
          <strong>Usage Data:</strong> We may collect information about how you use the App, such as the features you
          use, the words you search for, the crosswords you attempt, and your progress in the Wordle game.
        </Typography>
        <Typography>
          <strong>Device Information:</strong> We may collect information about the device you use to access the App,
          such as the device type, operating system, and unique device identifiers.
        </Typography>
        <Typography>
          <strong>Local Storage Data:</strong> We use local storage to store your game progress, such as your Wordle
          guesses and the current row.
        </Typography>

        <Typography variant="h6" gutterBottom>
          How We Use Your Information
        </Typography>
        <Typography>We may use your information for the following purposes:</Typography>
        <Typography>
          <strong>To Provide and Improve the App:</strong> We use your information to operate, maintain, and improve the
          App, including personalizing your experience.
        </Typography>
        <Typography>
          <strong>To Communicate with You:</strong> We may use your email address to send you updates, newsletters, or
          other information about the App.
        </Typography>
        <Typography>
          <strong>To Analyze Usage:</strong> We may use your information to analyze how users interact with the App to
          improve its design and functionality.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Disclosure of Your Information
        </Typography>
        <Typography>We may disclose your information in the following circumstances:</Typography>
        <Typography>
          <strong>With Your Consent:</strong> We may share your information with third parties if you have given us your
          consent to do so.
        </Typography>
        <Typography>
          <strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in
          response to a valid legal request.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Data Security
        </Typography>
        <Typography>
          We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However,
          no method of transmission over the internet or electronic storage is completely secure.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Data Retention
        </Typography>
        <Typography>
          We will retain your information for as long as your account is active or as needed to provide you with the
          App. We may also retain and use your information as necessary to comply with our legal obligations, resolve
          disputes, and enforce our agreements.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Your Rights
        </Typography>
        <Typography>
          You may have certain rights regarding your information, including the right to access, correct, or delete your
          information. Please contact us if you wish to exercise these rights.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Changes to This Privacy Policy
        </Typography>
        <Typography>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Contact Us
        </Typography>
        <Typography>
          If you have any questions about this Privacy Policy, please contact us at{" "}
          <Link href="mailto:support@verbaquest.com">support@verbaquest.com</Link>.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;

import { useState } from 'react';
import { generateRandomString } from '../../utilities/toolkit';

export type Props = {
  navigate: any,
  location: any,
  // Custom Props Start
  // Custom Props End
};

// Config
export const configJSON = require("./config");

// Controller
const SignUpController = (props: Props) => {
  // States Start
  const [exampleState, setExampleState] = useState("");
  // States End

  // Custom logic Start
  const handleExampleStateChange = () => {
    const randomString = generateRandomString(10);
    setExampleState(randomString);
  }
  // Custom logic End

  // Exporting states and logic
  return {
      exampleState,
      handleExampleStateChange
  };
};

export default SignUpController;
    
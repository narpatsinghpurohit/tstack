import { ChangeEvent, useState } from 'react';

export type Props = {
    navigate: any,
    location: any,
    // Custom Props Start
    // Custom Props End
};


// Config
export const configJSON = require("./config");

// Controller
const HomeController = (props: Props) => {
    // States Start
    const [email, setEmail] = useState("");
    // States End

    // Custom logic Start
    const handleEmailChange = (event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEmail(event.target.value);
    }

    const handleSubmit = () => {
        props.navigate('sign-up')
    }
    const handleSomething = () => {

    }
    // Custom logic End

    // Exporting states and logic
    return {
        email,
        handleEmailChange,
        handleSubmit,
        handleSomething
    };
};

export default HomeController;

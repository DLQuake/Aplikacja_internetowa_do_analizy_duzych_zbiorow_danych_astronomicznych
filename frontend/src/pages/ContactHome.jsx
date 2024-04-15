import React from "react";
import NavbarHome from "../components/NavbarHome";
import FooterHome from "../components/FooterHome";
import ContactForm from "../components/ContactForm";

const ContactHome = () => {
    return (
        <React.Fragment>
            <NavbarHome />
            <ContactForm />
            <FooterHome />
        </React.Fragment>
    );
};

export default ContactHome;

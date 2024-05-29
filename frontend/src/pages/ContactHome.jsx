import React from "react";
import NavbarHome from "../components/NavbarHome";
import FooterHome from "../components/FooterHome";
import ContactForm from "../components/ContactForm";

const ContactHome = () => {
    return (
        <React.Fragment>
            <NavbarHome />
            <div className="mt-6">
                <ContactForm />
            </div>
            <FooterHome />
        </React.Fragment>
    );
};

export default ContactHome;

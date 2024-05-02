import React, { useRef } from "react";
import emailjs from '@emailjs/browser';

const ContactForm = () => {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_ximyohd', 'template_qd00s0n', form.current, 'PYZQAnBlBCWe5HnPD')
            .then((result) => {
                console.log(result.text);
                alert("The message was sent");
            }, (error) => {
                console.log(error.text);
            });
        e.target.reset();
    };

    return (
        <section className="section">
            <form ref={form} onSubmit={sendEmail} className="columns is-centered">
                <div className="column is-10">
                    <div className="box">
                        <h1 className="title has-text-centered">Contact</h1>
                        <div className="field">
                            <label className="label">Name and surname</label>
                            <div className="control has-icons-left">
                                <input type="text" className="input is-medium" name="user_name" placeholder="Name and surname" />
                                <span class="icon is-small is-left">
                                    <i class="fa-solid fa-user"></i>
                                </span>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">E-mail</label>
                            <div className="control has-icons-left">
                                <input type="email" className="input is-medium" name="user_email" placeholder="E-mail" />
                                <span class="icon is-small is-left">
                                    <i class="fa-solid fa-envelope"></i>
                                </span>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Subject</label>
                            <div className="control has-icons-left">
                                <input type="text" className="input is-medium" name="subject" placeholder="Subject" />
                                <span class="icon is-small is-left">
                                    <i class="fa-solid fa-message"></i>
                                </span>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Message</label>
                            <div class="control">
                                <textarea class="textarea is-medium" rows="10" name="message" placeholder="Message content..."></textarea>
                            </div>
                        </div>
                        <div className="field mt-5 is-grouped is-grouped-centered">
                            <button type="submit" className="button is-link is-medium">Send a message</button>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default ContactForm;

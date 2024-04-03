import React, { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Tutaj możesz dodać logikę przesyłania danych kontaktowych do serwera
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Message:', message);
    };

    return (
        <div>
            <Header />
            <section className="hero is-fullheight px-5 py-5">
                <div className="container">
                    <h2 className="title">Contact Us</h2>
                    <div className="content">
                        <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec egestas sem non rhoncus dictum. Suspendisse id hendrerit urna, ut imperdiet metus. Proin mollis velit non odio tincidunt, ac pharetra quam luctus. Mauris nec posuere ligula, id imperdiet urna. Proin nec neque est. Aliquam aliquet ipsum vel laoreet faucibus. Nunc at erat non purus tempus interdum. Phasellus sed magna ex. Vestibulum placerat libero eget ultricies ornare. Maecenas sodales in mauris ac tempor. Aenean aliquam neque ac lorem tincidunt dapibus. Praesent ultrices tempor justo in ullamcorper. Quisque quis augue eleifend, elementum erat vitae, auctor mi. Fusce at sapien pulvinar, ornare sem porttitor, blandit libero. Suspendisse at ultrices diam, quis pretium ligula. Quisque volutpat est quis lorem congue, nec vehicula ex egestas.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Message</label>
                            <div className="control">
                                <textarea
                                    className="textarea"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button className="button is-primary" type="submit">Send Message</button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default ContactPage;

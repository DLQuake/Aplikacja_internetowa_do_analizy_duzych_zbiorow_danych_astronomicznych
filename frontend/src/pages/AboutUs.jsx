import React from "react";
import NavbarHome from "../components/NavbarHome";
import FooterHome from "../components/FooterHome";

const AboutUs = () => {
    return (
        <React.Fragment>
            <NavbarHome />
            <section className="section">
                <div class="content">
                    <h1 className="title is-1 has-text-centered">About Us</h1>
                </div>
                <div className="content box subtitle has-text-justified">
                    <p>
                        Welcome to our weather service! We are a team of weather enthusiasts who have been tracking and analyzing weather conditions for 
                        years. Our goal is to provide you with the most accurate and up-to-date weather forecast so you can plan your outdoor activities with 
                        confidence.
                        <br/><br/>
                        Our team consists of experienced meteorologists, programmers, and technology enthusiasts who work tirelessly to continuously improve 
                        our service. We constantly update our algorithms and technologies to ensure you have the latest weather data and intuitive tools for 
                        analysis.
                        <br/><br/>
                        We are constantly evolving to meet your expectations and provide you with comprehensive weather information in your area. Thanks to 
                        our advanced tools and specialized knowledge, you can be sure you are receiving reliable and accurate weather data.
                        <br/><br/>
                        We want you to feel safe and comfortable using our service, so we always strive to provide you with the best user experience possible. 
                        Thank you for being with us and we wish you successful weather searches!
                        <br/><br/>
                        Our mission is simple: to provide you with the most reliable and up-to-date weather information so you can make informed decisions 
                        about your outdoor activities. Whether you're planning a trip, a walk, or a barbecue outdoors, our service will help you plan every 
                        weather adventure.
                        <br/><br/>
                        As weather enthusiasts, we care about making our service not only functional but also aesthetically pleasing. We strive to make using 
                        our interface easy and intuitive so you can quickly find the weather information you need.
                        <br/><br/>
                        Your satisfaction and satisfaction with using our service are our top priorities. Therefore, we always welcome your feedback and 
                        suggestions for improving our service. Your feedback helps us continue to grow and improve our offerings.
                        <br/><br/>
                        Thank you for your trust and choosing our weather service. We hope to meet your expectations and that you will stay with us for years 
                        to come. We wish you successful weather searches and wonderful outdoor adventures!
                    </p>
                </div>
            </section>
            <FooterHome />
        </React.Fragment>
    );
};

export default AboutUs;
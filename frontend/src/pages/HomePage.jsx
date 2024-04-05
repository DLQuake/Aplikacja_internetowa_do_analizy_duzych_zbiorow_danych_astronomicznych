import React from "react";
import NavbarHome from "../components/NavbarHome";

const HomePage = () => {
    return (
        <React.Fragment>
            <NavbarHome />
            <section className="section has-background-link">
                <div class="content has-background-white p-6">
                    <h1>Welcome in TODO-List-app</h1>
                </div>
            </section>
        </React.Fragment>
    );
};

export default HomePage;

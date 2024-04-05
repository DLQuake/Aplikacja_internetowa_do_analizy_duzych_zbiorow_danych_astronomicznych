import React from "react";
import { useSelector } from "react-redux";

const Welcome = () => {
	const { user } = useSelector((state) => state.auth);
	return (
		<section className="hero">
			<div className="hero-body">
				<div className="container">
					<div className="column is-10">
						<div className="box">
							<h1 className="title has-text-centered">Dashboard</h1>
							<h2 className="subtitle has-text-centered">
								Hello user <strong>{user && user.imie} {user && user.nazwisko}</strong>
								<br />
								User role: {user && user.role}
							</h2>

							<div className="content">
								<p>After logging in to the main panel of the TODO application, you will have access to the full list of your tasks. On the home page, you'll see a list of all the tasks you've created, along with their titles, due dates, and priorities.</p>
								<p>You can easily manage your tasks, add new ones, modify existing ones or delete obsolete tasks. You will find all these options in an intuitive navigation panel.</p>
								<p>The navigation panel also allows you to filter tasks by priority, due date and category. This will allow you to find the most important tasks faster and focus on their implementation.</p>
								<p>In the TODO app, you will also find the option to add notes to your tasks and the ability to mark tasks as completed, which will allow you to track the progress of your tasks.</p>
								<p>If you are looking for a simple and effective tool to organize and manage your tasks, the TODO application is the perfect solution for you. Sign in today and start managing your time and tasks more effectively.</p>
							</div>

						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Welcome;

import './homepage.css';

function HomePage(){
	return(
		<div id="homePageMainContainer">
			<header className="bg-darker sticky top-0 z-50 shadow-lg">
				<div className="container mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
					<div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
						<i className="fas fa-graduation-cap text-white text-xl"></i>
					</div>
					<span className="text-xl font-bold text-white">EDU<span className="text-accent">VERGE</span></span>
					</div>

					<div className="md:hidden">
					<button id="menu-toggle" className="text-gray-300 hover:text-white focus:outline-none">
						<i className="fas fa-bars text-2xl"></i>
					</button>
					</div>
					
					<nav className="hidden md:flex items-center space-x-8">
					<a href="courses" className="nav-link text-gray-300 hover:text-white font-medium">Explore Courses</a>
					<a href="studyGroup" className="nav-link text-gray-300 hover:text-white font-medium">Study Groups</a>
					<a href="login" className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition duration-300">Login</a>
					</nav>
				</div>
				
				<div id="mobile-menu" className="hidden md:hidden mt-4 pb-4">
					<a href="#" className="block py-2 text-gray-300 hover:text-white">Home</a>
					<a href="#" className="block py-2 text-gray-300 hover:text-white">Study Guides</a>
					<a href="#" className="block py-2 text-gray-300 hover:text-white">Analytics</a>
					<a href="#" className="block py-2 text-gray-300 hover:text-white">Contact</a>
					<a href="#" className="block mt-4 bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium text-center w-full transition duration-300">Login</a>
				</div>
				</div>
			</header>
			
			<section className="gradient-bg py-20 md:py-32">
				<div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
				<div className="md:w-1/2 mb-12 md:mb-0">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
					Transform Your <span className="text-accent">Learning</span> Experience
					</h1>
					<p className="text-lg text-gray-300 mb-8 max-w-lg">
					Join thousands of students mastering their subjects with interactive study guides, peer collaboration, and personalized exam preparation.
					</p>
					<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
					<button className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-full font-medium transition duration-300 shadow-lg hover:shadow-xl">
						Get Started for Free
					</button>
					<button className="border border-accent text-accent hover:bg-blue-900/20 px-8 py-4 rounded-full font-medium transition duration-300">
						<i className="fas fa-play mr-2"></i> Watch Demo
					</button>
					</div>
				</div>
				<div className="md:w-1/2 flex justify-center">
					<div className="hero-image relative">
					<div className="w-80 h-80 md:w-96 md:h-96 bg-blue-900/20 rounded-3xl flex items-center justify-center">
						<img src="https://illustrations.popsy.co/amber/digital-nomad.svg" alt="Learning Illustration" className="w-full h-full object-contain"/>
					</div>
					<div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-500/20 rounded-2xl blur-xl"></div>
					<div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/20 rounded-2xl blur-xl"></div>
					</div>
				</div>
				</div>
			</section>

			<section className="py-12 bg-darker">
				<div className="container mx-auto px-6">
				<p className="text-center text-gray-400 mb-8">Trusted by students from</p>
				<div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
					<div className="text-2xl font-bold text-gray-300">University of Pretoria</div>
					<div className="text-2xl font-bold text-gray-300">University of Johannesburg</div>
					<div className="text-2xl font-bold text-gray-300">University of Cape Town</div>
					<div className="text-2xl font-bold text-gray-300">North-West University</div>
					<div className="text-2xl font-bold text-gray-300">University of South Africa</div>
				</div>
				</div>
			</section>
			
			<section className="py-20">
				<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose <span className="text-accent">EDUVERGE</span></h2>
					<p className="text-gray-400 max-w-2xl mx-auto">
					Our platform combines cutting-edge technology with proven learning methodologies to help you achieve academic success.
					</p>
				</div>
				
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					<div className="feature-card bg-slate-800/50 p-8 rounded-xl border border-slate-700/50 transition duration-300">
					<div className="w-14 h-14 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-accent text-2xl">
						<i className="fas fa-book-open"></i>
					</div>
					<h3 className="text-xl font-bold mb-3">Comprehensive Study Guides</h3>
					<p className="text-gray-400">
						Access subject-specific materials curated by top educators and high-achieving students.
					</p>
					</div>
					
					<div className="feature-card bg-slate-800/50 p-8 rounded-xl border border-slate-700/50 transition duration-300">
					<div className="w-14 h-14 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-accent text-2xl">
						<i className="fas fa-file-alt"></i>
					</div>
					<h3 className="text-xl font-bold mb-3">Smart Exam Portal</h3>
					<p className="text-gray-400">
						Adaptive mock tests with performance analytics to identify your strengths and weaknesses.
					</p>
					</div>
					
					<div className="feature-card bg-slate-800/50 p-8 rounded-xl border border-slate-700/50 transition duration-300">
					<div className="w-14 h-14 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-accent text-2xl">
						<i className="fas fa-users"></i>
					</div>
					<h3 className="text-xl font-bold mb-3">Peer Learning Network</h3>
					<p className="text-gray-400">
						Collaborate with study groups, share resources, and get real-time help from peers.
					</p>
					</div>
					
					<div className="feature-card bg-slate-800/50 p-8 rounded-xl border border-slate-700/50 transition duration-300">
					<div className="w-14 h-14 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-accent text-2xl">
						<i className="fas fa-chart-line"></i>
					</div>
					<h3 className="text-xl font-bold mb-3">Progress Analytics</h3>
					<p className="text-gray-400">
						Track your learning journey with detailed reports and personalized recommendations.
					</p>
					</div>
				</div>
				</div>
			</section>
			
			<section className="py-20 bg-darker">
				<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">How <span className="text-accent">EDUVERGE</span> Works</h2>
					<p className="text-gray-400 max-w-2xl mx-auto">
					Get started in just a few simple steps and transform your learning experience today.
					</p>
				</div>
				
				<div className="relative">
					<div className="hidden lg:block absolute left-1/2 h-full w-1 bg-gradient-to-b from-primary to-accent -ml-0.5"></div>
					
					<div className="space-y-16 lg:space-y-0">
					<div className="lg:flex lg:items-center lg:justify-between lg:odd:flex-row-reverse">
						<div className="lg:w-5/12 mb-8 lg:mb-0">
						<div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700/50">
							<div className="flex items-center mb-4">
							<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4">1</div>
							<h3 className="text-xl font-bold">Create Your Account</h3>
							</div>
							<p className="text-gray-400">
							Sign up in seconds with your email or social account. Tell us about your academic goals to get personalized recommendations.
							</p>
						</div>
						</div>
						<div className="lg:w-5/12 flex justify-center">
						<div className="w-full max-w-md bg-blue-900/20 rounded-xl p-6">
							<img src="https://illustrations.popsy.co/amber/online-learning.svg" alt="Create Account" className="w-full h-auto"/>
						</div>
						</div>
					</div>
					
					<div className="lg:flex lg:items-center lg:justify-between lg:odd:flex-row-reverse">
						<div className="lg:w-5/12 mb-8 lg:mb-0">
						<div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700/50">
							<div className="flex items-center mb-4">
							<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4">2</div>
							<h3 className="text-xl font-bold">Choose Your Subjects</h3>
							</div>
							<p className="text-gray-400">
							Select from hundreds of subjects and courses. Our AI will suggest the most relevant study materials based on your curriculum.
							</p>
						</div>
						</div>
						<div className="lg:w-5/12 flex justify-center">
						<div className="w-full max-w-md bg-blue-900/20 rounded-xl p-6">
							<img src="https://illustrations.popsy.co/amber/education.svg" alt="Choose Subjects" className="w-full h-auto"/>
						</div>
						</div>
					</div>
					
					<div className="lg:flex lg:items-center lg:justify-between lg:odd:flex-row-reverse">
						<div className="lg:w-5/12 mb-8 lg:mb-0">
						<div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700/50">
							<div className="flex items-center mb-4">
							<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4">3</div>
							<h3 className="text-xl font-bold">Start Learning</h3>
							</div>
							<p className="text-gray-400">
							Access interactive study guides, join study groups, take practice exams, and track your progress in real-time.
							</p>
						</div>
						</div>
						<div className="lg:w-5/12 flex justify-center">
						<div className="w-full max-w-md bg-blue-900/20 rounded-xl p-6">
							<img src="https://illustrations.popsy.co/amber/graduation.svg" alt="Start Learning" className="w-full h-auto"/>
						</div>
						</div>
					</div>
					</div>
				</div>
				</div>
			</section>

			<section className="py-20">
				<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">What Our <span className="text-accent">Students</span> Say</h2>
					<p className="text-gray-400 max-w-2xl mx-auto">
					Don't just take our word for it - hear from students who transformed their learning with EDUVERGE.
					</p>
				</div>
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700/50">
					<div className="flex items-center mb-4">
						<div className="w-12 h-12 rounded-full bg-blue-900/20 flex items-center justify-center text-accent text-xl mr-4">
						<i className="fas fa-user-graduate"></i>
						</div>
						<div>
						<h4 className="font-bold">Sfiso Mthembu</h4>
						<p className="text-gray-400 text-sm">University of Pretoria</p>
						</div>
					</div>
					<p className="text-gray-300 mb-4">
						"EDUVERGE helped me organize my study materials and connect with peers in my program. My grades improved by a full letter grade!"
					</p>
					<div className="flex text-yellow-400">
						<i className="fas fa-star"></i>
						<i className="fas fa-star"></i>
						<i className="fas fa-star"></i>
						<i className="fas fa-star"></i>
						<i className="fas fa-star"></i>
					</div>
					</div>
					
					<div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700/50">
					<div className="flex items-center mb-4">
						<div className="w-12 h-12 rounded-full bg-blue-900/20 flex items-center justify-center text-accent text-xl mr-4">
						<i className="fas fa-user-graduate"></i>
						</div>
						<div>
						<h4 className="font-bold">Michael Van der Merwe</h4>
						<p className="text-gray-400 text-sm">University of Cape Town</p>
						</div>
					</div>
					<p className="text-gray-300 mb-4">
						"The adaptive exam portal is incredible. It identified my weak areas and provided targeted practice that helped me ace my finals."
					</p>
					<div className="flex text-yellow-400">
						<i className="fas fa-star"></i>
						<i className="fas fa-star"></i>
						<i className="fas fa-star"></i>
						<i className="fas fa-star"></i>
						<i className="fas fa-star"></i>
					</div>
					</div>
					
					<div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700/50">
					<div className="flex items-center mb-4">
						<div className="w-12 h-12 rounded-full bg-blue-900/20 flex items-center justify-center text-accent text-xl mr-4">
						<i className="fas fa-user-graduate"></i>
						</div>
						<div>
						<h4 className="font-bold">Emma Manamela</h4>
						<p className="text-gray-400 text-sm">University of Johnnesburg</p>
						</div>
					</div>
					<p className="text-gray-300 mb-4">
						"I love the collaborative features. My study group uses EDUVERGE to share notes and quiz each other. It's made group study so much more effective."
					</p>
					<div className="flex text-yellow-400">
						<i className="fas fa-star"></i>
						<i className="fas fa-star"></i>
						<i className="fas fa-star"></i>
						<i className="fas fa-star"></i>
						<i className="fas fa-star-half-alt"></i>
					</div>
					</div>
				</div>
				</div>
			</section>

			<section className="py-20 bg-gradient-to-r from-blue-900/30 to-blue-800/30">
				<div className="container mx-auto px-6 text-center">
				<h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
				<p className="text-gray-300 max-w-2xl mx-auto mb-8">
					Join EDUVERGE today and get access to all premium features with our 7-day free trial. No credit card required.
				</p>
				<div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
					<button className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-full font-medium transition duration-300 shadow-lg hover:shadow-xl">
					Start Free Trial
					</button>
					<button className="border border-accent text-accent hover:bg-blue-900/20 px-8 py-4 rounded-full font-medium transition duration-300">
					Schedule a Demo
					</button>
				</div>
				</div>
			</section>

			<footer className="bg-darker py-12">
				<div className="container mx-auto px-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					<div>
					<div className="flex items-center space-x-2 mb-4">
						<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
						<i className="fas fa-graduation-cap text-white text-lg"></i>
						</div>
						<span className="text-xl font-bold text-white">EDU<span className="text-accent">VERGE</span></span>
					</div>
					<p className="text-gray-400 mb-4">
						The interactive peer-to-peer learning platform that helps students excel.
					</p>
					<div className="flex space-x-4">
						<a href="#" className="text-gray-400 hover:text-accent transition duration-300">
						<i className="fab fa-facebook-f"></i>
						</a>
						<a href="#" className="text-gray-400 hover:text-accent transition duration-300">
						<i className="fab fa-twitter"></i>
						</a>
						<a href="#" className="text-gray-400 hover:text-accent transition duration-300">
						<i className="fab fa-instagram"></i>
						</a>
						<a href="#" className="text-gray-400 hover:text-accent transition duration-300">
						<i className="fab fa-linkedin-in"></i>
						</a>
					</div>
					</div>
					
					<div>
					<h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
					<ul className="space-y-2">
						<li><a href="#" className="text-gray-400 hover:text-accent transition duration-300">Home</a></li>
						<li><a href="#" className="text-gray-400 hover:text-accent transition duration-300">About Us</a></li>
						<li><a href="#" className="text-gray-400 hover:text-accent transition duration-300">Features</a></li>
						<li><a href="#" className="text-gray-400 hover:text-accent transition duration-300">Pricing</a></li>
						<li><a href="#" className="text-gray-400 hover:text-accent transition duration-300">Contact</a></li>
					</ul>
					</div>
					
					<div>
					<h3 className="text-lg font-bold text-white mb-4">Resources</h3>
					<ul className="space-y-2">
						<li><a href="#" className="text-gray-400 hover:text-accent transition duration-300">Study Guides</a></li>
						<li><a href="#" className="text-gray-400 hover:text-accent transition duration-300">Exam Portal</a></li>
						<li><a href="#" className="text-gray-400 hover:text-accent transition duration-300">Blog</a></li>
						<li><a href="#" className="text-gray-400 hover:text-accent transition duration-300">Help Center</a></li>
						<li><a href="#" className="text-gray-400 hover:text-accent transition duration-300">Community</a></li>
					</ul>
					</div>
					
					<div>
					<h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
					<ul className="space-y-2">
						<li className="flex items-start">
						<i className="fas fa-map-marker-alt text-accent mt-1 mr-3"></i>
						<span className="text-gray-400">1784 Church Street, Pretoria Central, 0008</span>
						</li>
						<li className="flex items-center">
						<i className="fas fa-envelope text-accent mr-3"></i>
						<span className="text-gray-400">studentadmin@eduverge.com</span>
						</li>
						<li className="flex items-center">
						<i className="fas fa-phone-alt text-accent mr-3"></i>
						<span className="text-gray-400">(076) 770-9806</span>
						</li>
					</ul>
					</div>
				</div>
				
				<div className="border-t border-slate-700 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center">
					<p className="text-gray-400 text-sm mb-4 md:mb-0">
						&copy; 2025 EDUVERGE. All rights reserved.
					</p>
					<div className="flex space-x-6">
						<a href="#" className="text-gray-400 hover:text-accent text-sm transition duration-300">Privacy Policy</a>
						<a href="#" className="text-gray-400 hover:text-accent text-sm transition duration-300">Terms of Service</a>
						<a href="#" className="text-gray-400 hover:text-accent text-sm transition duration-300">Cookie Policy</a>
					</div>
					</div>
				</div>
				</div>
			</footer>
		</div>
	)
};

export default HomePage;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Sparkles, Bookmark, HeartHandshake } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 px-6 md:px-10 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">About Little Genius</h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Empowering young minds with free, high-quality education to build a brighter future.
            </p>
          </div>
        </section>

        <section className="py-16 px-6 md:px-10">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  At Little Genius, we believe that quality education should be accessible to everyone, 
                  regardless of their background or financial situation. Our platform is built on the 
                  principle that knowledge is a right, not a privilege.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We're dedicated to providing free, engaging, and transformative learning experiences 
                  that help young people develop valuable skills, discover their passions, and prepare 
                  for a successful future in our rapidly changing world.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8 shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80" 
                  alt="Students learning" 
                  className="rounded-xl shadow-md"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 md:px-10 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">What Makes Us Different</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow hover:shadow-md transition-all">
                <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Users className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Focused</h3>
                <p className="text-gray-700">
                  We foster a supportive community where students can collaborate, share ideas, and grow together.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow hover:shadow-md transition-all">
                <div className="bg-purple-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Sparkles className="text-purple-600" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
                <p className="text-gray-700">
                  Our courses feature engaging content, quizzes, and interactive exercises for effective learning.
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 shadow hover:shadow-md transition-all">
                <div className="bg-amber-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Bookmark className="text-amber-600" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Educators</h3>
                <p className="text-gray-700">
                  Learn from passionate educators who are experts in their fields and dedicated to student success.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 shadow hover:shadow-md transition-all">
                <div className="bg-green-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <HeartHandshake className="text-green-600" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fully Free</h3>
                <p className="text-gray-700">
                  We're committed to keeping all our courses completely free, forever, with no hidden costs.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 md:px-10 bg-gradient-to-br from-indigo-50 to-blue-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                We envision a world where every young person has access to high-quality education that helps them 
                discover their talents, develop crucial skills, and pursue their dreams. By removing financial 
                barriers to learning, we're working toward a more equitable future where opportunity is truly available to all.
              </p>
              <div className="inline-flex items-center justify-center p-0.5 overflow-hidden text-lg font-medium rounded-lg group bg-gradient-to-br from-purple-500 to-blue-500">
                <a href="/" className="px-8 py-3 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 group-hover:text-white">
                  Explore Our Courses
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Eye, 
  Award, 
  Users, 
  BookOpen,
  Heart,
  Zap,
  Shield
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Our Mission',
      description: 'To provide a world-class library management platform that makes education accessible and efficient for everyone.',
      color: 'blue'
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: 'Our Vision',
      description: 'To revolutionize the library management industry through innovation, technology, and student-centric solutions.',
      color: 'purple'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Our Values',
      description: 'Integrity, excellence, innovation, and commitment to student success guide everything we do.',
      color: 'pink'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Our Promise',
      description: 'Delivering reliable, secure, and user-friendly services that exceed expectations every single day.',
      color: 'green'
    },
  ];

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Modern Infrastructure',
      description: 'State-of-the-art facilities with comfortable seating and study environment'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Expert Support',
      description: 'Dedicated team available 24/7 to assist with any queries or concerns'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Fast Processing',
      description: 'Quick admission approval and instant seat allocation system'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure Payments',
      description: 'Bank-level security with multiple payment options for your convenience'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl font-bold mb-6">About LakshyaLibrary</h1>
            <p className="text-xl text-white/90 leading-relaxed">
              We are committed to providing the best library management experience 
              through innovative technology and exceptional service. Our platform 
              empowers students and simplifies administration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex p-4 rounded-full bg-${value.color}-100 dark:bg-${value.color}-900/20 text-${value.color}-600 dark:text-${value.color}-400 mb-4`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We combine cutting-edge technology with exceptional service to deliver the best experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="flex-shrink-0">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { value: '5+', label: 'Years Experience' },
                { value: '500+', label: 'Happy Students' },
                { value: '50+', label: 'Study Seats' },
                { value: '99%', label: 'Satisfaction' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Our Commitment
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We are dedicated to creating an environment where students can focus on their studies 
              while we handle all the administrative complexities seamlessly.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                At LakshyaLibrary, we believe that access to quality study spaces should be simple, 
                affordable, and hassle-free. Our platform is built with this philosophy at its core, 
                combining modern technology with user-centric design.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                We continuously invest in improving our infrastructure, technology, and services to 
                ensure that every student has the best possible experience. From instant seat booking 
                to automated fee management, every feature is designed with you in mind.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Join us in our mission to make quality education infrastructure accessible to all. 
                Together, we can create a community of focused learners achieving their goals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

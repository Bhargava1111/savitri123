import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Users } from
'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon."
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
  {
    icon: <Phone className="w-6 h-6 text-blue-500" data-id="nweo39nli" data-path="src/pages/ContactPage.tsx" />,
    title: 'Phone',
    details: '+1 (555) 123-4567',
    description: 'Mon-Fri 9AM-6PM EST'
  },
  {
    icon: <Mail className="w-6 h-6 text-green-500" data-id="c79p0qgf1" data-path="src/pages/ContactPage.tsx" />,
    title: 'Email',
    details: 'support@manafoods.com',
    description: 'We reply within 24 hours'
  },
  {
    icon: <MapPin className="w-6 h-6 text-red-500" data-id="gjtt8w87w" data-path="src/pages/ContactPage.tsx" />,
    title: 'Office',
    details: '123 Commerce Street',
    description: 'Business District, NY 10001'
  },
  {
    icon: <Clock className="w-6 h-6 text-purple-500" data-id="rvo99zrjm" data-path="src/pages/ContactPage.tsx" />,
    title: 'Business Hours',
    details: 'Mon-Fri: 9AM-6PM',
    description: 'Weekend: 10AM-4PM EST'
  }];


  const supportCategories = [
  {
    icon: <MessageCircle className="w-8 h-8 text-blue-500" data-id="rhakkeaop" data-path="src/pages/ContactPage.tsx" />,
    title: 'General Inquiry',
    description: 'Questions about our products or services'
  },
  {
    icon: <Headphones className="w-8 h-8 text-green-500" data-id="wyn9xwqhp" data-path="src/pages/ContactPage.tsx" />,
    title: 'Technical Support',
    description: 'Help with orders, returns, or technical issues'
  },
  {
    icon: <Users className="w-8 h-8 text-purple-500" data-id="sjkytok4b" data-path="src/pages/ContactPage.tsx" />,
    title: 'Business Partnership',
    description: 'Interested in partnering with us?'
  }];


  return (
    <div className="min-h-screen bg-gray-50 py-8" data-id="bzxpnyxgj" data-path="src/pages/ContactPage.tsx">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-id="scwzyx64c" data-path="src/pages/ContactPage.tsx">
        {/* Header */}
        <div className="text-center mb-12" data-id="7v0ktqw3s" data-path="src/pages/ContactPage.tsx">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-id="g5e4ci81t" data-path="src/pages/ContactPage.tsx">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-id="jmphz69wr" data-path="src/pages/ContactPage.tsx">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16" data-id="j620d1sl6" data-path="src/pages/ContactPage.tsx">
          {/* Contact Form */}
          <div className="lg:col-span-2" data-id="iehqvvqby" data-path="src/pages/ContactPage.tsx">
            <Card data-id="rrb2ofq1a" data-path="src/pages/ContactPage.tsx">
              <CardHeader data-id="i5r0cz7q4" data-path="src/pages/ContactPage.tsx">
                <CardTitle className="flex items-center" data-id="yaa04emo6" data-path="src/pages/ContactPage.tsx">
                  <Send className="w-5 h-5 mr-2" data-id="1cov2hc3o" data-path="src/pages/ContactPage.tsx" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent data-id="5f55ma54s" data-path="src/pages/ContactPage.tsx">
                <form onSubmit={handleSubmit} className="space-y-6" data-id="cqe54yic1" data-path="src/pages/ContactPage.tsx">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="mj3r6pdk4" data-path="src/pages/ContactPage.tsx">
                    <div data-id="ba10mwn8g" data-path="src/pages/ContactPage.tsx">
                      <Label htmlFor="name" data-id="tva16z7hi" data-path="src/pages/ContactPage.tsx">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name" data-id="sir0hp0sy" data-path="src/pages/ContactPage.tsx" />

                    </div>
                    <div data-id="2a9enkxwg" data-path="src/pages/ContactPage.tsx">
                      <Label htmlFor="email" data-id="srw7m45rj" data-path="src/pages/ContactPage.tsx">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com" data-id="yyx9mspul" data-path="src/pages/ContactPage.tsx" />

                    </div>
                  </div>
                  
                  <div data-id="wwv74kbrh" data-path="src/pages/ContactPage.tsx">
                    <Label htmlFor="subject" data-id="3mnxlslv1" data-path="src/pages/ContactPage.tsx">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="What is this regarding?" data-id="wd8xhrcdx" data-path="src/pages/ContactPage.tsx" />

                  </div>
                  
                  <div data-id="p7haqzvsh" data-path="src/pages/ContactPage.tsx">
                    <Label htmlFor="message" data-id="y30dvxl2c" data-path="src/pages/ContactPage.tsx">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Tell us how we can help you..."
                      rows={6} data-id="u1x8le0fx" data-path="src/pages/ContactPage.tsx" />

                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting} data-id="rrtkn78ra" data-path="src/pages/ContactPage.tsx">

                    {isSubmitting ?
                    'Sending...' :

                    <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" data-id="j0nvidfhe" data-path="src/pages/ContactPage.tsx" />
                      </>
                    }
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6" data-id="oiraqjk1j" data-path="src/pages/ContactPage.tsx">
            <Card data-id="u0ylgvsv8" data-path="src/pages/ContactPage.tsx">
              <CardHeader data-id="puipq5u49" data-path="src/pages/ContactPage.tsx">
                <CardTitle data-id="x72te2qp7" data-path="src/pages/ContactPage.tsx">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-id="gq26on6ci" data-path="src/pages/ContactPage.tsx">
                {contactInfo.map((info, index) =>
                <div key={index} className="flex items-start space-x-3" data-id="qmiyxqfi4" data-path="src/pages/ContactPage.tsx">
                    <div className="flex-shrink-0 mt-1" data-id="9cayoyvwd" data-path="src/pages/ContactPage.tsx">
                      {info.icon}
                    </div>
                    <div data-id="nwtnr9fnz" data-path="src/pages/ContactPage.tsx">
                      <h3 className="font-semibold text-gray-900" data-id="pvwygxcfh" data-path="src/pages/ContactPage.tsx">
                        {info.title}
                      </h3>
                      <p className="text-gray-700" data-id="ftitrj44x" data-path="src/pages/ContactPage.tsx">
                        {info.details}
                      </p>
                      <p className="text-sm text-gray-500" data-id="hl3sdazsl" data-path="src/pages/ContactPage.tsx">
                        {info.description}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card data-id="12osrecbt" data-path="src/pages/ContactPage.tsx">
              <CardHeader data-id="o2nvl8prt" data-path="src/pages/ContactPage.tsx">
                <CardTitle data-id="o1qka2b4t" data-path="src/pages/ContactPage.tsx">Office Location</CardTitle>
              </CardHeader>
              <CardContent data-id="r6zokj147" data-path="src/pages/ContactPage.tsx">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden" data-id="8ywdghiud" data-path="src/pages/ContactPage.tsx">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25280164647!2d-74.1197632!3d40.6974034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location" data-id="x0xwq52tl" data-path="src/pages/ContactPage.tsx" />

                </div>
                <p className="text-sm text-gray-600" data-id="7pwpekntk" data-path="src/pages/ContactPage.tsx">
                  Visit us at our headquarters in the heart of New York's business district.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Categories */}
        <div className="mb-16" data-id="oqqux3f2g" data-path="src/pages/ContactPage.tsx">
          <div className="text-center mb-8" data-id="pios3vem6" data-path="src/pages/ContactPage.tsx">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-id="5h1hv9h31" data-path="src/pages/ContactPage.tsx">
              How Can We Help?
            </h2>
            <p className="text-gray-600" data-id="y294xchk7" data-path="src/pages/ContactPage.tsx">
              Choose the category that best describes your inquiry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-id="dwluoz74o" data-path="src/pages/ContactPage.tsx">
            {supportCategories.map((category, index) =>
            <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer group" data-id="ox0pv28i4" data-path="src/pages/ContactPage.tsx">
                <CardContent className="p-6" data-id="fef30ld9y" data-path="src/pages/ContactPage.tsx">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform" data-id="5kvdtdqpo" data-path="src/pages/ContactPage.tsx">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" data-id="5wvzgkgl6" data-path="src/pages/ContactPage.tsx">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm" data-id="udt4f2gjb" data-path="src/pages/ContactPage.tsx">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <Card data-id="kfqi4gujd" data-path="src/pages/ContactPage.tsx">
          <CardHeader data-id="hk0yajibe" data-path="src/pages/ContactPage.tsx">
            <CardTitle data-id="r6ziuithc" data-path="src/pages/ContactPage.tsx">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent data-id="4ztndkfeh" data-path="src/pages/ContactPage.tsx">
            <div className="space-y-4" data-id="7mt0gh8st" data-path="src/pages/ContactPage.tsx">
              <div data-id="hpode417q" data-path="src/pages/ContactPage.tsx">
                <h3 className="font-semibold text-gray-900 mb-2" data-id="9mhp378y9" data-path="src/pages/ContactPage.tsx">
                  What are your shipping options?
                </h3>
                <p className="text-gray-600 text-sm" data-id="12ui8durp" data-path="src/pages/ContactPage.tsx">
                  We offer free standard shipping on orders over $99, express shipping (1-2 days), 
                  and overnight delivery options.
                </p>
              </div>
              <div data-id="kw28vnftv" data-path="src/pages/ContactPage.tsx">
                <h3 className="font-semibold text-gray-900 mb-2" data-id="4jqg9xo6i" data-path="src/pages/ContactPage.tsx">
                  How can I track my order?
                </h3>
                <p className="text-gray-600 text-sm" data-id="g9i074ocz" data-path="src/pages/ContactPage.tsx">
                  Once your order ships, you'll receive a tracking number via email. 
                  You can also track orders in your account dashboard.
                </p>
              </div>
              <div data-id="dviut1emu" data-path="src/pages/ContactPage.tsx">
                <h3 className="font-semibold text-gray-900 mb-2" data-id="6wwsnyd5i" data-path="src/pages/ContactPage.tsx">
                  What is your return policy?
                </h3>
                <p className="text-gray-600 text-sm" data-id="s9t6a6ww3" data-path="src/pages/ContactPage.tsx">
                  We offer a 30-day return policy for unused items in original packaging. 
                  Returns are free for defective or damaged items.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

};

export default ContactPage;

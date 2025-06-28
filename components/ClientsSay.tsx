import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

export default function ClientsSay() {
  const testimonials = [
    {
      name: "Adebayo Johnson",
      location: "Lagos, Nigeria",
      role: "Network Leader",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      testimonial:
        "Bright Orion changed my life completely! I've earned over ₦2.5 million in just 8 months. The system is transparent and payments are always on time.",
      earnings: "₦2.5M+ earned",
    },
    {
      name: "Fatima Abdullahi",
      location: "Abuja, Nigeria",
      role: "Top Performer",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      testimonial:
        "As a single mother, this platform gave me financial independence. I can now provide for my children while working from home. Highly recommended!",
      earnings: "₦1.8M+ earned",
    },
    {
      name: "Chinedu Okafor",
      location: "Port Harcourt, Nigeria",
      role: "Rising Star",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      testimonial:
        "I was skeptical at first, but after seeing my first commission of ₦45,000 in week 2, I knew this was real. Now I'm earning consistently every month.",
      earnings: "₦950K+ earned",
    },
    {
      name: "Blessing Okoro",
      location: "Enugu, Nigeria",
      role: "Success Story",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      testimonial:
        "The support system is amazing! The team helped me build my network from zero to over 200 active members. This is not just business, it's family.",
      earnings: "₦1.2M+ earned",
    },
    {
      name: "Ibrahim Musa",
      location: "Kano, Nigeria",
      role: "Team Builder",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      testimonial:
        "From struggling to pay bills to earning 6 figures monthly. Bright Orion gave me hope when I had none. Forever grateful to this platform!",
      earnings: "₦3.1M+ earned",
    },
    {
      name: "Grace Adeola",
      location: "Ibadan, Nigeria",
      role: "Mentor",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      testimonial:
        "I've tried many MLM platforms before, but none compare to Bright Orion. The transparency, support, and earning potential are unmatched.",
      earnings: "₦2.8M+ earned",
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-green-100 text-green-800 mb-4">Success Stories</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Members Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of successful entrepreneurs who have transformed their lives with Bright Orion
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative">
              <CardContent className="space-y-4">
                <div className="absolute top-4 right-4">
                  <Quote className="w-8 h-8 text-blue-100" />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const fallback = target.nextElementSibling as HTMLElement
                        if (fallback) fallback.style.display = "flex"
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg"
                      style={{ display: "none" }}
                    >
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {testimonial.role}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-700 italic leading-relaxed">"{testimonial.testimonial}"</p>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Earnings:</span>
                    <span className="font-bold text-green-600">{testimonial.earnings}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-[#0066E0]">5,000+</div>
              <div className="text-sm text-gray-600">Happy Members</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-green-600">₦50M+</div>
              <div className="text-sm text-gray-600">Total Paid Out</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600">4.9/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">94%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

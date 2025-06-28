import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Users, TrendingUp, Award, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Register & Activate",
      description: "Sign up with your details and activate your account with just ₦36,000",
      icon: UserPlus,
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
    },
    {
      step: "02",
      title: "Build Your Network",
      description: "Invite friends and family to join your network and start earning commissions",
      icon: Users,
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
    },
    {
      step: "03",
      title: "Earn Commissions",
      description: "Get paid instantly as your network grows through our 6-level matrix system",
      icon: TrendingUp,
      image:
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-blue-800 mb-4">How It Works</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Start Earning in 3 Simple Steps</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our proven system makes it easy for anyone to start earning. Follow these simple steps to begin your
            journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="relative p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="space-y-4">
                <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
                  <Image
                    src={step.image || "/placeholder.svg"}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = "flex"
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-[#0066E0]/20 to-[#00266C]/40 flex items-center justify-center"
                    style={{ display: "none" }}
                  >
                    <step.icon className="w-16 h-16 text-white" />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#0066E0] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  <step.icon className="w-6 h-6 text-[#0066E0]" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-[#0066E0]" />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Matrix System Explanation */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our 6-Level Matrix System</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Earn commissions from 6 levels deep in your network. The more people you refer, the more you earn!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              {[
                { level: "Level 1", commission: "₦5,000", description: "Direct referrals" },
                { level: "Level 2", commission: "₦3,000", description: "2nd level referrals" },
                { level: "Level 3", commission: "₦2,000", description: "3rd level referrals" },
                { level: "Level 4", commission: "₦1,500", description: "4th level referrals" },
                { level: "Level 5", commission: "₦1,000", description: "5th level referrals" },
                { level: "Level 6", commission: "₦500", description: "6th level referrals" },
              ].map((level, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#0066E0] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{level.level}</p>
                      <p className="text-sm text-gray-600">{level.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{level.commission}</p>
                    <p className="text-xs text-gray-500">per referral</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-center mb-4">
                  <Award className="w-12 h-12 text-[#FFD700] mx-auto mb-2" />
                  <h4 className="text-xl font-bold text-gray-900">Potential Monthly Earnings</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Conservative (10 referrals)</span>
                    <span className="font-bold text-green-600">₦130,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Moderate (25 referrals)</span>
                    <span className="font-bold text-blue-600">₦325,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium">Aggressive (50 referrals)</span>
                    <span className="font-bold text-yellow-600">₦650,000</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">
                  *Earnings depend on network activity and referral performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProjectStats() {
  const stats = [
    { title: "Total Projects", value: "324" },
    { title: "Developers", value: "1,245" },
    { title: "Avg Team Size", value: "3.8" },
    { title: "Total Plays", value: "28,567" },
  ]

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-gray-800 bg-gray-950">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

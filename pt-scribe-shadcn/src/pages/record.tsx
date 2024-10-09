import { Link } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react"
import { useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Header from "../components/header"


// Sample data arrays
const dashboardCards = [
  {
    title: "Subjective",
  },
  {
    title: "Objective",
  },
  {
    title: "Assessment",
  },
  {
    title: "Plan",
  },
];
export function Record() {
  const [recording, setRecording] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header currentPage="record" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2 order-2 lg:order-1 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <CardHeader className="flex flex-row items-center sticky top-0 bg-background z-10">
              <div className="grid gap-2">
                <CardTitle>Your Notes</CardTitle>
                <CardDescription>
                  AI generated notes from your session.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link to="#">
                  Push to EHR
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {dashboardCards.map((card) => (
                <div key={card.title} className="flex flex-col gap-2 p-4">
                  <div className="text-2xl">{card.title}</div>
                  <Textarea placeholder="Wait for AI to generate notes..." className="min-h-[100px]" />
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="order-1 lg:order-2">
            <Card className="lg:h-[calc(100vh-8rem)] lg:sticky lg:top-4 flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle>Transcript</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-8 flex-grow overflow-hidden">
                <div className="grid gap-2 flex-shrink-0">
                  <Input
                    id="patient"
                    type="patient"
                    placeholder="Patient Name"
                    required
                  />
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button type="submit" className="w-full" onClick={() => setRecording(!recording)}>
                    {recording ? "Stop" : "Record"}
                  </Button>
                  <Button variant="outline" className="w-full">
                    Generate Notes
                  </Button>
                </div>
                <div className="flex-grow overflow-y-auto">
                  <Textarea placeholder="Generated Transcript..." readOnly className="h-full resize-none" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
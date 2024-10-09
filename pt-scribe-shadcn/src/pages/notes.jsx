import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from "../components/header"

import { MoreHorizontal } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function Notes() {
  var tableData = [
    {
      Patient: "John Doe",
      Date: "2024-03-15",
      Length: "30",
      Type: "Consultation"
    },
    {
      Patient: "John Doe",
      Date: "2024-03-16",
      Length: "60",
      Type: "Consultation"
    }
  ];

  const doubleData = (data) => {
    return [...data, ...data.map(item => ({...item}))];
  };

  const generateData = (initialData, targetCount) => {
    let result = [...initialData];
    while (result.length < targetCount) {
      result = doubleData(result);
    }
    return result.slice(0, targetCount);
  };

  tableData = generateData(tableData, 12);
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header currentPage="notes" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="flex flex-col h-[calc(100vh-120px)]">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Notes</CardTitle>
            <CardDescription>
              View and manage your patient notes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <div className="overflow-auto h-full">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="bg-background">Patient</TableHead>
                    <TableHead className="bg-background">Date</TableHead>
                    <TableHead className="bg-background">Length (min)</TableHead>
                    <TableHead className="bg-background">Type</TableHead>
                    <TableHead className="bg-background">Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.Patient}</TableCell>
                      <TableCell>{item.Date}</TableCell>
                      <TableCell>{item.Length}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.Type}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex-shrink-0">
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-{tableData.length}</strong> of <strong>{tableData.length}</strong> notes
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

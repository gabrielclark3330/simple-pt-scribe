import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from "../components/header"
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
import { Trash2, Eye } from "lucide-react"; // Importing Eye and Trash2 icons

import API from '../api/api';
import { format } from 'date-fns'; // Import date-fns for date formatting

export function Notes() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await API.get('/notes');
        const notes = response.data;

        // Format the data as needed
        const formattedNotes = notes.map(note => ({
          Patient: `${note.patient_first_name} ${note.patient_last_name}`,
          Date: format(new Date(note.date_recorded), 'PPpp'),
          Length: note.length,
          Type: note.type,
          NoteID: note.id,
          PatientID: note.patient_id,
        }));
        setTableData(formattedNotes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        // Handle the error, e.g., redirect to login if unauthorized
      }
    };

    fetchNotes();
  }, []);

  const formatLength = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

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
                    <TableHead className="bg-background">View</TableHead>
                    <TableHead className="bg-background">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.Patient}</TableCell>
                      <TableCell>{item.Date}</TableCell>
                      <TableCell>{formatLength(item.Length)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.Type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Link to={`/app/patient/${item.PatientID}?noteId=${item.NoteID}`}>
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-primary" />
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex items-center gap-2 text-red-500 hover:bg-transparent"
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this note?')) {
                              try {
                                await API.delete(`/notes/${item.NoteID}`);
                                setTableData(tableData.filter((_, idx) => idx !== index));
                              } catch (error) {
                                console.error('Error deleting note:', error);
                              }
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
  );
}

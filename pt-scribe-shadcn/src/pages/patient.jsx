import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '@/src/api/api';
import Header from "@/src/components/header";
import { File, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";

export function Patient() {
  const { id } = useParams(); // Get patient ID from URL
  const [patient, setPatient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);

  const handleCopy = (content, section) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setCopiedSection(section); // Set the copied section
        // Reset the copied section after 2 seconds
        setTimeout(() => setCopiedSection(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  useEffect(() => {
    const fetchPatientAndNotes = async () => {
      try {
        // Fetch patient details
        const patientResponse = await API.get(`/patients/${id}`);
        setPatient(patientResponse.data);

        // Fetch notes for this patient
        const notesResponse = await API.get(`/notes/patient/${id}`);
        setNotes(notesResponse.data);

        // Check if noteId is provided in the URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const noteIdParam = urlParams.get('noteId');
        if (noteIdParam) {
          const foundNote = notesResponse.data.find(note => note.id === Number(noteIdParam));
          if (foundNote) {
            setSelectedNote(foundNote);
          }
        }
      } catch (error) {
        console.error('Error fetching patient or notes:', error);
      }
    };

    fetchPatientAndNotes();
  }, [id]);

  const formatLength = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header currentPage="patient" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {patient ? (
          <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
            {/* Left Side: Notes Table */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>{patient.first_name} {patient.last_name}</CardTitle>
                <CardDescription>Patient Notes</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Length</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notes.map(note => (
                      <TableRow
                        key={note.id}
                        className={`cursor-pointer ${
                          selectedNote && selectedNote.id === note.id ? 'bg-accent' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedNote(note)}
                      >
                        <TableCell>{format(new Date(note.date_recorded), 'PPpp')}</TableCell>
                        <TableCell>{formatLength(note.length)}</TableCell>
                        <TableCell><Badge variant="outline">{note.type}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Right Side: Note Content */}
            <Card className="lg:col-span-2">
              {selectedNote ? (
                <>
                  <CardHeader>
                    <CardTitle>Note Details</CardTitle>
                    <CardDescription>
                      Date: {format(new Date(selectedNote.date_recorded), 'PPpp')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(selectedNote.note_content).map(([section, content]) => (
                      <div key={section} className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold capitalize">{section}</h3>
                          <Button
                            size="sm"
                            variant="outline"
                            className={`h-7 gap-1 text-sm transition-colors duration-200 ${
                              copiedSection === section
                                ? 'bg-green-100 text-green-700'
                                : 'hover:bg-gray-200'
                            }`}
                            onClick={() => handleCopy(content, section)}
                          >
                            {copiedSection === section ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only">Copied</span>
                              </>
                            ) : (
                              <>
                                <File className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only">Copy</span>
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="whitespace-pre-wrap">{content}</p>
                      </div>
                    ))}
                  </CardContent>
                  <CardDescription className="p-4">
                    Date: {format(new Date(selectedNote.date_recorded), 'PPpp')}
                    <br />
                    Length: {formatLength(selectedNote.length)}
                  </CardDescription>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <h3 className="text-xl font-semibold capitalize text-center">Select a note to view its details</h3>
                </CardContent>
              )}
            </Card>
          </div>
        ) : (
          <p>Loading patient data...</p>
        )}
      </main>
    </div>
  );
}

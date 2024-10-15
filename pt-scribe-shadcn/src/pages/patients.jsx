import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Header from '../components/header';
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";

import API from '@/src/api/api';

export function Patients() {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({ first_name: '', last_name: '' });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await API.get('/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/patients', newPatient);
      setPatients([...patients, response.data]);
      setNewPatient({ first_name: '', last_name: '' });
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header currentPage="patients" />
      <main className="flex flex-1 flex-col gap-4 px-4 md:gap-8 md:p-8">
        <Card className="flex flex-col h-[calc(100vh-120px)]">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Patients</CardTitle>
              <CardDescription>
                View and manage your patient records.
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Patient</Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleAddPatient} className="space-y-4">
                  <DialogHeader>
                    <DialogTitle>Add New Patient</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to add a new patient.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-row gap-2">
                    <Input
                      placeholder="First Name"
                      value={newPatient.first_name}
                      onChange={(e) => setNewPatient({ ...newPatient, first_name: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Last Name"
                      value={newPatient.last_name}
                      onChange={(e) => setNewPatient({ ...newPatient, last_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="ghost">
                      Cancel
                    </Button>
                    <Button type="submit">Add</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <div className="overflow-auto h-full">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="bg-background">First Name</TableHead>
                    <TableHead className="bg-background">Last Name</TableHead>
                    <TableHead className="bg-background">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.first_name}</TableCell>
                      <TableCell>{patient.last_name}</TableCell>
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
                            <DropdownMenuItem asChild>
                              <Link to={`/patients/${patient.id}`}>View</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/patients/edit/${patient.id}`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={async () => {
                                if (window.confirm('Are you sure you want to delete this patient?')) {
                                  try {
                                    await API.delete(`/patients/${patient.id}`);
                                    setPatients(patients.filter(p => p.id !== patient.id));
                                  } catch (error) {
                                    console.error('Error deleting patient:', error);
                                  }
                                }
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
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
              Showing <strong>1-{patients.length}</strong> of <strong>{patients.length}</strong> patients
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

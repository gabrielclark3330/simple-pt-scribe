/*
import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import API from '@/src/api/api';

export function PatientSelector({ selectedPatient, setSelectedPatient }) {
  const [open, setOpen] = React.useState(false);
  const [patients, setPatients] = React.useState([]);
  const [value, setValue] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);
  const [newPatient, setNewPatient] = React.useState({ first_name: '', last_name: '' });
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
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
      setSelectedPatient(response.data);
      setValue(response.data.first_name + ' ' + response.data.last_name);
      setNewPatient({ first_name: '', last_name: '' });
      setIsAdding(false);
      setOpen(false);
    } catch (error) {
      console.error('Error adding patient:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Failed to add patient. Please try again.');
      }
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            {selectedPatient
              ? `${selectedPatient.first_name} ${selectedPatient.last_name}`
              : "Select patient..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search patient..." />
            <CommandList>
              <CommandEmpty>No patient found.</CommandEmpty>
              <CommandGroup>
                {patients.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    value={patient.id}
                    onSelect={(currentValue) => {
                      const selected = patients.find(p => p.id === currentValue);
                      setSelectedPatient(selected);
                      setValue(`${selected.first_name} ${selected.last_name}`);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedPatient && selectedPatient.id === patient.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {patient.first_name} {patient.last_name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setIsAdding(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add new patient
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogTrigger asChild>
          <span></span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new patient.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPatient} className="space-y-4">
            {errorMessage && (
              <div className="mb-4 p-2 text-red-600 border border-red-300 rounded">
                {errorMessage}
              </div>
            )}
            <div className="flex flex-col space-y-2">
              <label htmlFor="first_name" className="text-sm font-medium">
                First Name
              </label>
              <Input
                id="first_name"
                value={newPatient.first_name}
                onChange={(e) => setNewPatient({ ...newPatient, first_name: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="last_name" className="text-sm font-medium">
                Last Name
              </label>
              <Input
                id="last_name"
                value={newPatient.last_name}
                onChange={(e) => setNewPatient({ ...newPatient, last_name: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Patient</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
*/

"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import API from '@/src/api/api';

export function PatientSelector({ selectedPatient, setSelectedPatient }) {
  const [open, setOpen] = React.useState(false);
  const [patients, setPatients] = React.useState([]);
  const [value, setValue] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);
  const [newPatient, setNewPatient] = React.useState({ first_name: '', last_name: '' });
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const response = await API.get('/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        // Optionally, set an error state to display to users
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await API.post('/patients', newPatient);
      setPatients([...patients, response.data]);
      setSelectedPatient(response.data);
      setValue(`${response.data.first_name} ${response.data.last_name}`);
      setNewPatient({ first_name: '', last_name: '' });
      setIsAdding(false);
      setOpen(false);
    } catch (error) {
      console.error('Error adding patient:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Failed to add patient. Please try again.');
      }
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            {selectedPatient
              ? `${selectedPatient.first_name} ${selectedPatient.last_name}`
              : "Select patient..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search patient..." />
            <CommandList>
              <CommandEmpty>No patient found.</CommandEmpty>
              <CommandGroup>
                {patients.map((patient) => (
                  <CommandItem
                    key={`${patient.first_name} ${patient.last_name} ${patient.id}`}
                    value={`${patient.first_name} ${patient.last_name} ${patient.id}`}
                    onSelect={(currentValue) => {
                      const selected = patients.find(p => p.id === Number(currentValue)); // Convert to number
                      if (selected) { // Add check to prevent undefined
                        setSelectedPatient(selected);
                        setValue(`${selected.first_name} ${selected.last_name}`);
                        setOpen(false);
                      } else {
                        console.warn(`Patient with id ${currentValue} not found.`);
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedPatient && selectedPatient.id === Number(patient.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {patient.first_name} {patient.last_name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setIsAdding(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add new patient
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Dialog for Adding New Patient */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogTrigger asChild>
          {/* Hidden trigger since we control it programmatically */}
          <span></span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new patient.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPatient} className="space-y-4">
            {errorMessage && (
              <div className="mb-4 p-2 text-red-600 border border-red-300 rounded">
                {errorMessage}
              </div>
            )}
            <div className="flex flex-row gap-2">
                <div className="flex flex-col space-y-2">
                <label htmlFor="first_name" className="text-sm font-medium">
                    First Name
                </label>
                <Input
                    id="first_name"
                    value={newPatient.first_name}
                    onChange={(e) => setNewPatient({ ...newPatient, first_name: e.target.value })}
                    required
                />
                </div>
                <div className="flex flex-col space-y-2">
                <label htmlFor="last_name" className="text-sm font-medium">
                    Last Name
                </label>
                <Input
                    id="last_name"
                    value={newPatient.last_name}
                    onChange={(e) => setNewPatient({ ...newPatient, last_name: e.target.value })}
                    required
                />
                </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Patient</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

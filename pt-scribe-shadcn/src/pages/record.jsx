import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/src/components/header";
import { ReactMic } from 'react-mic';
import API from '@/src/api/api';
import { AuthContext } from '../contexts/AuthContext';
import { PatientSelector } from '../components/PatientSelector';

export function Record() {
  const { user } = useContext(AuthContext);
  const [timer, setTimer] = useState(0);
  const timerIntervalRef = useRef(null);
  const [length, setLength] = useState(0);
  const [recording, setRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [notes, setNotes] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });
  const [noteId, setNoteId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState('All changes saved');

  const [selectedPatient, setSelectedPatient] = useState(null); // New state for selected patient

  const audioContextRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartRecording = () => {
    // Initialize or resume AudioContext after user gesture
    if (audioContextRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } else {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    setRecording(true);
    setTimer(0);

    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        const newTimer = prevTimer + 1;
        console.log(newTimer); // Logs the updated timer value
        return newTimer;
      });
    }, 1000);

  };

  const handleStopRecording = () => {
    setLength(timer);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setRecording(false);
  };

  const onStop = async (recordedBlob) => {
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('audio', recordedBlob.blob, 'recording.webm');

    try {
      const response = await API.post('/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscript(response.data.transcript);
      setNotes(response.data.notes);
      setIsDirty(true);
      setSaveStatus('Unsaved changes');
    } catch (error) {
      console.error('Error transcribing audio:', error);
      // Optionally, set an error state to inform the user
      setSaveStatus('Error processing transcription');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = useCallback(async () => {
    if (!user) {
      setSaveStatus('User not authenticated');
      return;
    }
  
    if (!selectedPatient) {
      setSaveStatus('Please select a patient');
      return;
    }
  
    try {
      if (!noteId) {
        // Create a new note
        const response = await API.post('/notes', {
          patient_id: selectedPatient.id,
          transcript,
          length,
          date_recorded: new Date().toISOString(),
          type: 'record',
          note_owner: user.id,
          note_content: notes,
        });
        setNoteId(response.data.id);
        setIsDirty(false);
        setSaveStatus('All changes saved');
      } else {
        // Update existing note
        await API.put(`/notes/${noteId}`, {
          patient_id: selectedPatient.id,
          transcript,
          length,
          date_recorded: new Date().toISOString(),
          type: 'record',
          note_owner: user.id,
          note_content: notes,
        });
        setIsDirty(false);
        setSaveStatus('All changes saved');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setSaveStatus('Error saving note');
    }
  }, [user, selectedPatient, transcript, notes, noteId, length]);

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
              <Button
                variant="primary"
                size="sm"
                className="ml-auto gap-1"
                onClick={handleSave}
                disabled={!isDirty || isProcessing || !selectedPatient}
              >
                Save
                {isProcessing && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
              </Button>
              <div className="ml-4 text-sm text-muted-foreground">
                {saveStatus}
              </div>
            </CardHeader>
            <CardContent>
              {Object.keys(notes).map((note) => (
                <div key={note} className="flex flex-col gap-2 p-4">
                  <div className="text-2xl capitalize">{note}</div>
                  <Textarea
                    placeholder="Wait for AI to generate notes..."
                    className="min-h-[100px]"
                    value={notes[note]}
                    onChange={(e) => {
                      setNotes({ ...notes, [note]: e.target.value });
                      setIsDirty(true);
                      setSaveStatus('Unsaved changes');
                    }}
                  />
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
                <ReactMic
                  record={recording}
                  className="w-full"
                  onStop={onStop}
                  mimeType="audio/webm"
                  visualSetting="sinewave"
                />
                {recording && (
                  <div className="text-center text-xl font-bold">
                    Recording Time: {formatTime(timer)}
                  </div>
                )}
                <div className="grid gap-2 flex-shrink-0">
                  <PatientSelector selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} />
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={recording ? handleStopRecording : handleStartRecording}
                  >
                    {recording ? "Stop" : "Record"}
                  </Button>
                </div>
                <div className="flex-grow overflow-y-auto">
                  <Textarea
                    placeholder="Generated Transcript..."
                    readOnly
                    className="h-full resize-none"
                    value={transcript}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState, useRef } from 'react';
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

export function Record() {
  const [recording, setRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [notes, setNotes] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });

  const audioContextRef = useRef(null);

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
  };

  const handleStopRecording = () => {
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
    } catch (error) {
      console.error('Error transcribing audio:', error);
      // Handle error appropriately
    } finally {
      setIsProcessing(false);
    }
  };

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
              {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            </CardHeader>
            <CardContent>
              {Object.keys(notes).map((note) => (
                <div key={note} className="flex flex-col gap-2 p-4">
                  <div className="text-2xl capitalize">{note}</div>
                  <Textarea
                    placeholder="Wait for AI to generate notes..."
                    className="min-h-[100px]"
                    value={notes[note]}
                    onChange={(e) => setNotes({ ...notes, [note]: e.target.value })}
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
                <div className="grid gap-2 flex-shrink-0">
                  <Input
                    id="patient"
                    type="text"
                    placeholder="Patient Name"
                    required
                    className="mt-2"
                  />
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
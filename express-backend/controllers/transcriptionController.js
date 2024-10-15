import axios from 'axios';
import dotenv from 'dotenv';
import FormData from 'form-data';
dotenv.config();

export const transcribeAudio = async (req, res) => {
  try {
    const audioBuffer = req.file.buffer;

    const formData = new FormData();
    formData.append('file', audioBuffer, {
      filename: 'audio.webm', // Ensure correct filename and extension
      contentType: 'audio/webm',
    });
    formData.append('model', 'whisper-1');

    // Transcribe the audio using OpenAI's Whisper
    const transcriptResponse = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const transcript = transcriptResponse.data.text;

    const notesSchema = {
      name: "medical_notes",
      strict: true,
      schema: {
        type: "object",
        properties: {
          subjective: { type: "string" },
          objective: { type: "string" },
          assessment: { type: "string" },
          plan: { type: "string" }
        },
        required: ["subjective", "objective", "assessment", "plan"],
        additionalProperties: false
      }
    };

    const notesResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that formats medical transcripts into structured JSON with the following keys: subjective, objective, assessment, plan.',
          },
          {
            role: 'user',
            content: `Please generate note sections for the following transcript and output them as a JSON object with the keys: subjective, objective, assessment, and plan.\n\nTranscript:\n${transcript}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: notesSchema
        },
        temperature: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const apiResponse = notesResponse.data;
    console.log(apiResponse);

    if (
      apiResponse.choices &&
      apiResponse.choices[0].message &&
      apiResponse.choices[0].message.refusal
    ) {
      console.error('GPT-4o Refusal:', apiResponse.choices[0].message.refusal);
      return res.status(403).json({ error: 'GPT-4o refused the request.' });
    }

    let notes;
    try {
      notes = apiResponse.choices[0].message.content;
    } catch (jsonError) {
      console.error('Error parsing JSON from GPT-4o response:', jsonError);
      console.error('GPT-4o Response:', apiResponse.choices[0].message.content);
      return res.status(500).json({ error: 'Failed to parse notes from GPT-4o response.' });
    }
    notes = JSON.parse(notes);
    const requiredSections = ['subjective', 'objective', 'assessment', 'plan'];
    for (const section of requiredSections) {
      if (!notes.hasOwnProperty(section)) {
        console.error(`Missing section "${section}" in GPT-4o response.`);
        return res.status(500).json({ error: `Missing section "${section}" in notes.` });
      }
    }

    res.status(200).json({ transcript, notes });
  } catch (error) {
    console.error('Error during transcription or note extraction:', error.response?.data || error.message);
    res.status(500).json({ error: 'Transcription or note extraction failed' });
  }
};

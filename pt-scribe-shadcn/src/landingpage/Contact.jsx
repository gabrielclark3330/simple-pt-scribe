import { useState } from "react";
//import { generateClient } from 'aws-amplify/api';

//const gqClient = generateClient();

export default function Contact() {

  const [formState, setFormState] = useState({ email: '', subject: '', message: '' });

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }
  /*
  async function updateUserRecordingStatus() {
    var result = (await gqClient.graphql({
      query: createNewUserForm, variables: {
        input: {
          email: formState.email,
          subject: formState.subject,
          message: formState.message,
        },
      }
    })).data.createNewUserForm;
    console.log(result);
    return result;
  }*/
  async function updateUserRecordingStatus(){return null;}

  return (
    <section className="">
      <div className="h-20" />
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900">
          Get in touch
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 sm:text-xl">
          Have a technical issue? Want to send feedback about a beta feature?
          Need help onboarding? Let us know.
        </p>
        <form className="space-y-8">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              className="shadow-sm bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="name@pt-scribe.com"
              required
              onChange={event => setInput('email', event.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="block p-3 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Let us know how we can help you"
              required
              onChange={event => setInput('subject', event.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your message
            </label>
            <textarea
              id="message"
              rows="6"
              className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg shadow-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Leave a comment..."
              onChange={event => setInput('message', event.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-600 sm:w-fit hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
            onClick={(e)=>{e.preventDefault(); updateUserRecordingStatus();}}
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}

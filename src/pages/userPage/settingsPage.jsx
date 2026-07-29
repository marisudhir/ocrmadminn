import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa'; 

// Reusable Input Component with Tailwind
const InputGroup = ({ label, placeholder, type = 'text', value, onChange, className = '' }) => (
  <div className={`mb-5 ${className}`}>
    <label className="block mb-2 font-semibold text-sm text-gray-700">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
    />
  </div>
);

// Reusable Button Component with Tailwind
const Button = ({ text, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${className}`}
  >
    {text}
  </button>
);

// Reusable Toggle Switch Component with Tailwind
const ToggleSwitch = ({ label, isChecked, onToggle }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
    <span className="text-gray-700">{label}</span>
    <div
      onClick={onToggle}
      className={`relative w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        isChecked ? 'bg-gray-800' : 'bg-gray-300'
      }`}
    >
      <div
        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
          isChecked ? 'translate-x-5' : 'translate-x-0'
        }`}
      ></div>
    </div>
  </div>
);

// Main Settings Page Component
const SettingsPage = () => {
  const [name, setName] = useState('John Doe');
  const [username, setUsername] = useState('johndoe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('********');
  const [taskReminders, setTaskReminders] = useState(true);
  const [emailSync, setEmailSync] = useState(false);
  const [calendarSync, setCalendarSync] = useState(true);

  const handleSaveChanges = () => {
    console.log('Saving changes:', {
      name,
      username,
      email,
      password: 'password_changed', // In a real app, send actual new password, not masked
      taskReminders,
      emailSync,
      calendarSync,
    });
    alert('Changes saved successfully!');
  };

  const handleChangeEmail = () => {
    alert('Initiating E-Mail ID change process...');
  };

  const handleChangePassword = () => {
    alert('Initiating password change process...');
  };

  const handleUploadPicture = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) { // 500kb in bytes
        alert('File size exceeds 500kb limit. Please choose a smaller image.');
        return;
      }
      console.log('Selected picture for upload:', file.name, file);
      alert(`Uploading ${file.name}... (This is a mock upload)`);
    }
  };

  return (
    <div className="max-h-60vh bg-gray-100 flex overflow-y-scroll items-center justify-center p-6">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-3xl w-full">
        <h1 className="text-3xl font-semibold mb-10 text-gray-800">Settings</h1>

        <div className="mb-10">
          <h2 className="text-2xl font-medium mb-6 pb-4 border-b border-gray-200 text-gray-800">User Profile</h2>
          <div className="flex gap-12 items-start">
            <div className="flex-grow"> {/* Form fields */}
              <InputGroup
                label="Name"
                placeholder="Enter the name here"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <InputGroup
                label="User Name"
                placeholder="Enter the user name here"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <div className="flex items-end gap-4 mb-5">
                <InputGroup
                  label="E-mail ID"
                  placeholder="Enter the E-mail ID here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow" // Allow input to grow
                />
                <Button text="Change E-Mail ID" onClick={handleChangeEmail} className="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200" />
              </div>

              <div className="flex items-end gap-4 mb-5">
                <InputGroup
                  label="Password"
                  placeholder="Enter the password here"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-grow" // Allow input to grow
                />
                <Button text="Change password" onClick={handleChangePassword} className="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200" />
              </div>
            </div>

            <div className="w-1/3 text-center pt-8"> {/* Upload picture area */}
              <h3 className="text-lg font-medium mb-4 text-gray-700">Upload Picture</h3>
              <label htmlFor="picture-upload"
                className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl mx-auto cursor-pointer bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors duration-200"
              >
                <FaCloudUploadAlt className="text-6xl text-gray-400" />
                <input
                  id="picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleUploadPicture}
                  className="hidden" // Hide the default file input
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">Max upload size 500kb</p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <ToggleSwitch
            label="Task Reminders"
            isChecked={taskReminders}
            onToggle={() => setTaskReminders(!taskReminders)}
          />
          <ToggleSwitch
            label="E-Mail Sync"
            isChecked={emailSync}
            onToggle={() => setEmailSync(!emailSync)}
          />
          <ToggleSwitch
            label="Calendar Sync"
            isChecked={calendarSync}
            onToggle={() => setCalendarSync(!calendarSync)}
          />
        </div>

        <Button
          text="Save Changes"
          onClick={handleSaveChanges}
          className="bg-gray-800 text-white hover:bg-gray-900 w-full"
        />
      </div>
    </div>
  );
};

export default SettingsPage;
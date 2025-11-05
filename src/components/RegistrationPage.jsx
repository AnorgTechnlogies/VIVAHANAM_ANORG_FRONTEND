import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  registerUser,
  clearErrors,
  clearMessage,
} from "../store/slices/userSlice";

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.user);
  const emailInputRef = useRef(null);
  const [documents, setDocuments] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "", // ← Always starts empty
    password: "",
    mobileNo: "",
    residentCountry: "India",
    userType: "",
    gender: "",
    dateOfBirth: "",
    religion: "",
    motherTongue: "",
    maritalStatus: "",
    height: "",
    physicalStatus: "",
    educationLevel: "",
    fieldOfStudy: "",
    occupation: "",
    employer: "",
    annualIncome: "",
    profileBio: "",
    hobbies: "",
    languages: "",
    district: "",
    city: "",
    state: "",
    currentCity: "",
    nativePlace: "",
    birthTime: "",
    placeOfBirth: "",
    zodiacSign: "",
    gotra: "",
    familyType: "",
    familyStatus: "",
    fatherName: "",
    fatherOccupation: "",
    fatherStatus: "",
    motherName: "",
    motherOccupation: "",
    motherStatus: "",
    numBrothers: 0,
    numSisters: 0,
    siblingsMaritalStatus: "",
    aboutFamily: "",
    familyBackground: "",
    partnerPreferences: {
      ageRange: { min: "", max: "" },
      preferredReligion: "",
      preferredMotherTongue: "",
      preferredEducation: "",
      preferredOccupation: "",
      preferredLocation: "",
      incomeRange: { min: "", max: "" },
      preferredHeight: { min: "", max: "" },
      preferredLanguages: "",
      culturalBackground: "",
    },
    showEmail: false,
    showMobile: false,
    profileVisibility: "Member",
    photoVisibility: "All",
  });

  const [profileImage, setProfileImage] = useState(null);
  // Add this function with your other handlers
  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    // Validate file types (optional)
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "image/jpg",
    ];
    const validFiles = files.filter(
      (file) => allowedTypes.includes(file.type) || file.type === ""
    );

    if (validFiles.length < files.length) {
      alert(`Some files were rejected. Allowed: JPG, PNG, PDF`);
    }

    setDocuments((prev) => [...prev, ...validFiles]);
  };

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    // Clear React state
    setFormData((prev) => ({ ...prev, email: "" }));

    // Clear browser autofill (runs after render)
    const timer = setTimeout(() => {
      if (emailInputRef.current) {
        emailInputRef.current.value = "";
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const getNestedValue = (obj, path) => {
    return path
      .split(".")
      .reduce((o, p) => (o && o[p] !== undefined ? o[p] : undefined), obj);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updateValue = type === "checkbox" ? checked : value;
      if (name.includes(".")) {
        const keys = name.split(".");
        let current = { ...prev };
        let temp = current;
        for (let i = 0; i < keys.length - 1; i++) {
          if (temp[keys[i]] === undefined || temp[keys[i]] === null) {
            temp[keys[i]] = keys[i].endsWith("Range")
              ? { min: "", max: "" }
              : "";
          }
          temp = temp[keys[i]];
        }
        temp[keys[keys.length - 1]] = updateValue;
        return current;
      }
      return { ...prev, [name]: updateValue };
    });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearErrors());
    dispatch(clearMessage());

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "mobileNo",
      "userType",
      "gender",
      "dateOfBirth",
      "religion",
      "maritalStatus",
      "city",
      "state",
      "educationLevel",
      "occupation",
      "partnerPreferences.ageRange.min",
      "partnerPreferences.ageRange.max",
    ];

    const hasErrors = requiredFields.some((field) => {
      const value = getNestedValue(formData, field);
      return (
        !value ||
        value.toString().trim() === "" ||
        (typeof value === "number" && value === 0)
      );
    });

    if (hasErrors) {
      alert("Please fill all required fields.");
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (key === "partnerPreferences") {
        const cleanPreferences = {};
        Object.keys(value).forEach((subKey) => {
          const subValue = value[subKey];
          if (["ageRange", "incomeRange", "preferredHeight"].includes(subKey)) {
            const cleanSubObject = {};
            Object.keys(subValue).forEach((subSubKey) => {
              if (
                subValue[subSubKey] !== "" &&
                subValue[subSubKey] !== undefined
              ) {
                cleanSubObject[subSubKey] = subValue[subSubKey];
              }
            });
            if (Object.keys(cleanSubObject).length > 0) {
              cleanPreferences[subKey] = cleanSubObject;
            }
          } else if (subValue !== "" && subValue !== undefined) {
            cleanPreferences[subKey] =
              typeof subValue === "string" && subValue.includes(",")
                ? subValue
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item !== "")
                : [subValue];
          }
        });
        if (Object.keys(cleanPreferences).length > 0) {
          submitData.append(key, JSON.stringify(cleanPreferences));
        }
      } else if (
        ["hobbies", "languages", "siblingsMaritalStatus"].includes(key)
      ) {
        if (value !== "" && value !== undefined) {
          const arrayValue =
            typeof value === "string"
              ? value
                  .split(",")
                  .map((item) => item.trim())
                  .filter((item) => item !== "")
              : value;
          if (arrayValue.length > 0) {
            submitData.append(key, JSON.stringify(arrayValue));
          }
        }
      } else if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        (typeof value !== "number" || value !== 0)
      ) {
        submitData.append(key, value);
      }
    });

    if (profileImage) submitData.append("profileImage", profileImage);
    dispatch(registerUser(submitData));
  };

  return (
    <div className="min-h-screen relative overflow-hidden px-4 pt-30 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-amber-100 opacity-90"></div>
      <div className="relative z-10 flex items-center justify-center py-8">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-700">
              वसुधैव कुटुम्बकम्
            </h2>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Join Vivahanam - Find Your Life Partner
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your profile to start your Vivahanam journey
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 space-y-6 border border-orange-100">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {message}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
              autoComplete="off"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  General & Basic Info
                </h3>
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        First Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        autoComplete="given-name"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Middle Name (optional)
                      </label>
                      <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleInputChange}
                        autoComplete="additional-name"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div> */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        autoComplete="family-name"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        ref={emailInputRef}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="you@example.com"
                        autoComplete="new-email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        autoComplete="new-password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mobile Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobileNo"
                        value={formData.mobileNo}
                        onChange={handleInputChange}
                        required
                        autoComplete="tel"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        User Type <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select Type</option>
                        <option value="self">Self</option>
                        <option value="parent">Parent</option>
                        <option value="Relative">Relative</option>
                        <option value="agent">Agent</option>
                      </select>
                    </div>
                  </div>
                 <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Diet <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select Type</option>
                        <option value="self">Vegetarian</option>
                        <option value="parent">Eggetarian</option>
                        <option value="parent">non Vegetarian</option>
                         <option value="parent">vegan </option>
                          
                  
                      </select>
                    </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date of Birth <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Gender <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        {/* <option value="Other">Other</option> */}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="religion"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Religion *
                      </label>
                      <input
                        type="text"
                        id="religion"
                        name="religion"
                        value={formData.religion}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="maritalStatus"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Marital Status *
                      </label>
                      <select
                        id="maritalStatus"
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select Status</option>
                        <option value="Never Married">Unmarried</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Awaiting Divorce">
                          Awaiting Divorce
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Education */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Location & Education
                </h3>
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label
                        htmlFor="district"
                        className="block text-sm font-medium text-gray-700"
                      >
                        District (optional)
                      </label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="currentCity"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Current City (optional)
                      </label>
                      <input
                        type="text"
                        id="currentCity"
                        name="currentCity"
                        value={formData.currentCity}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="nativePlace"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Native Place (optional)
                      </label>
                      <input
                        type="text"
                        id="nativePlace"
                        name="nativePlace"
                        value={formData.nativePlace}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="educationLevel"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Education Level *
                      </label>
                      <input
                        type="text"
                        id="educationLevel"
                        name="educationLevel"
                        value={formData.educationLevel}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="fieldOfStudy"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Field of Study (optional)
                      </label>
                      <input
                        type="text"
                        id="fieldOfStudy"
                        name="fieldOfStudy"
                        value={formData.fieldOfStudy}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="occupation"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Occupation *
                      </label>
                      <input
                        type="text"
                        id="occupation"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="employer"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Employer (optional)
                      </label>
                      <input
                        type="text"
                        id="employer"
                        name="employer"
                        value={formData.employer}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="annualIncome"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Annual Income (optional)
                      </label>
                      <input
                        type="text"
                        id="annualIncome"
                        name="annualIncome"
                        value={formData.annualIncome}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="height"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Height (optional)
                      </label>
                      <input
                        type="text"
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="physicalStatus"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Physical Status / Health Check (optional)
                    </label>
                    <textarea
                      id="physicalStatus"
                      name="physicalStatus"
                      rows={2}
                      value={formData.physicalStatus}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Religion & Cultural */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Religion & Cultural
                </h3>
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="caste"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Caste (optional)
                      </label>
                      <input
                        type="text"
                        id="caste"
                        name="caste"
                        value={formData.caste}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="motherTongue"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mother Tongue (optional)
                      </label>
                      <input
                        type="text"
                        id="motherTongue"
                        name="motherTongue"
                        value={formData.motherTongue}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="birthTime"
                        className="block text-sm font-medium text-gray-700"
                      >
                        DOB Time (optional)
                      </label>
                      <input
                        type="time"
                        id="birthTime"
                        name="birthTime"
                        value={formData.birthTime}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="placeOfBirth"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Place of Birth (optional)
                      </label>
                      <input
                        type="text"
                        id="placeOfBirth"
                        name="placeOfBirth"
                        value={formData.placeOfBirth}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="zodiacSign"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Zodiac Sign (optional)
                      </label>
                      <input
                        type="text"
                        id="zodiacSign"
                        name="zodiacSign"
                        value={formData.zodiacSign}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="gotra"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Gotra (optional)
                      </label>
                      <input
                        type="text"
                        id="gotra"
                        name="gotra"
                        value={formData.gotra}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Family Details */}
              {/* <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Family Details
                </h3>
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="familyType"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Family Type (optional)
                      </label>
                      <select
                        id="familyType"
                        name="familyType"
                        value={formData.familyType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select Type</option>
                        <option value="Joint">Joint</option>
                        <option value="Nuclear">Nuclear</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="familyStatus"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Family Status (optional)
                      </label>
                      <select
                        id="familyStatus"
                        name="familyStatus"
                        value={formData.familyStatus}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select Status</option>
                        <option value="Upper Class">Upper Class</option>
                        <option value="Middle Class">Middle Class</option>
                        <option value="Affluent Class">Affluent Class</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label
                        htmlFor="fatherName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Father's Name (optional)
                      </label>
                      <input
                        type="text"
                        id="fatherName"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="fatherOccupation"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Father's Occupation (optional)
                      </label>
                      <input
                        type="text"
                        id="fatherOccupation"
                        name="fatherOccupation"
                        value={formData.fatherOccupation}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="fatherStatus"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Father's Status (optional)
                      </label>
                      <input
                        type="text"
                        id="fatherStatus"
                        name="fatherStatus"
                        value={formData.fatherStatus}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label
                        htmlFor="motherName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mother's Name (optional)
                      </label>
                      <input
                        type="text"
                        id="motherName"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="motherOccupation"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mother's Occupation (optional)
                      </label>
                      <input
                        type="text"
                        id="motherOccupation"
                        name="motherOccupation"
                        value={formData.motherOccupation}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="motherStatus"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mother's Status (optional)
                      </label>
                      <input
                        type="text"
                        id="motherStatus"
                        name="motherStatus"
                        value={formData.motherStatus}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="numBrothers"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Number of Brothers (optional)
                      </label>
                      <input
                        type="number"
                        id="numBrothers"
                        name="numBrothers"
                        value={formData.numBrothers}
                        onChange={handleInputChange}
                        min={0}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="numSisters"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Number of Sisters (optional)
                      </label>
                      <input
                        type="number"
                        id="numSisters"
                        name="numSisters"
                        value={formData.numSisters}
                        onChange={handleInputChange}
                        min={0}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="siblingsMaritalStatus"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Marital Status of Siblings (optional)
                    </label>
                    <textarea
                      id="siblingsMaritalStatus"
                      name="siblingsMaritalStatus"
                      rows={2}
                      value={formData.siblingsMaritalStatus}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="aboutFamily"
                      className="block text-sm font-medium text-gray-700"
                    >
                      About Family (optional)
                    </label>
                    <textarea
                      id="aboutFamily"
                      name="aboutFamily"
                      rows={3}
                      value={formData.aboutFamily}
                      onChange={handleInputChange}
                      maxLength={500}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="familyBackground"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Family Background (optional)
                    </label>
                    <textarea
                      id="familyBackground"
                      name="familyBackground"
                      rows={3}
                      value={formData.familyBackground}
                      onChange={handleInputChange}
                      maxLength={500}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    />
                  </div>
                </div>
              </div> */}

              {/* // Adress DEtails */}

              <div>
                <h3 className="text-lg font-medium text-gray-900">Address</h3>
                <div className="mt-4 space-y-6">
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="United States"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="streetAddress"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="addressLine2"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        id="addressLine2"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State / Region / Province
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="zipCode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Postal / Zip Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="citizenshipStatus"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Citizenship Status <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <input
                          id="citizen"
                          name="citizenshipStatus"
                          type="radio"
                          value="US Citizen"
                          checked={formData.citizenshipStatus === "US Citizen"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <label
                          htmlFor="citizen"
                          className="ml-3 text-sm text-gray-700"
                        >
                          US Citizen
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="greenCard"
                          name="citizenshipStatus"
                          type="radio"
                          value="Green Card Holder"
                          checked={
                            formData.citizenshipStatus === "Green Card Holder"
                          }
                          onChange={handleInputChange}
                          className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <label
                          htmlFor="greenCard"
                          className="ml-3 text-sm text-gray-700"
                        >
                          Green Card Holder
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="other"
                          name="citizenshipStatus"
                          type="radio"
                          value="Other"
                          checked={formData.citizenshipStatus === "Other"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <label
                          htmlFor="other"
                          className="ml-3 text-sm text-gray-700"
                        >
                          Other
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile & Personal */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Profile & Personal
                </h3>
                <div className="mt-4 space-y-6">
                  <div>
                    <label
                      htmlFor="profileImage"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Profile Image (optional)
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profileBio"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Profile Bio (optional, max 500 chars)
                    </label>
                    <textarea
                      id="profileBio"
                      name="profileBio"
                      rows={3}
                      value={formData.profileBio}
                      onChange={handleInputChange}
                      maxLength={500}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Upload Documents (Optional)
                      <span className="text-xs text-gray-500 ml-2">
                        ID Proof, Passport, etc.
                      </span>
                    </h3>
                    <div className="mt-4 space-y-3">
                      <input
                        type="file"
                        multiple
                        onChange={handleDocumentChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                      />

                      {/* Show uploaded files */}
                      {documents.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium text-gray-700">
                            Uploaded Files:
                          </p>
                          {documents.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm"
                            >
                              <span className="truncate max-w-xs">
                                {doc.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeDocument(index)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="hobbies"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Hobbies / Interests (optional, comma separated)
                      </label>
                      <input
                        type="text"
                        id="hobbies"
                        name="hobbies"
                        value={formData.hobbies}
                        onChange={handleInputChange}
                        placeholder="e.g., Reading, Travel, Music"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="languages"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Languages (optional, comma separated)
                      </label>
                      <input
                        type="text"
                        id="languages"
                        name="languages"
                        value={formData.languages}
                        onChange={handleInputChange}
                        placeholder="e.g., English, Hindi, Tamil"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Partner Preferences */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Partner Preferences
                </h3>
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Age Range *
                      </label>
                      <div className="space-y-2">
                        <input
                          type="number"
                          name="partnerPreferences.ageRange.min"
                          value={formData.partnerPreferences.ageRange.min}
                          onChange={handleInputChange}
                          placeholder="Min Age"
                          min={18}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <input
                          type="number"
                          name="partnerPreferences.ageRange.max"
                          value={formData.partnerPreferences.ageRange.max}
                          onChange={handleInputChange}
                          placeholder="Max Age"
                          min={18}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="partnerPreferences.preferredReligion"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Preferred Religion (optional, comma separated)
                      </label>
                      <input
                        type="text"
                        id="partnerPreferences.preferredReligion"
                        name="partnerPreferences.preferredReligion"
                        value={formData.partnerPreferences.preferredReligion}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="partnerPreferences.preferredCaste"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Preferred Caste (optional, comma separated)
                      </label>
                      <input
                        type="text"
                        id="partnerPreferences.preferredCaste"
                        name="partnerPreferences.preferredCaste"
                        value={formData.partnerPreferences.preferredCaste}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="partnerPreferences.preferredMotherTongue"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Preferred Mother Tongue (optional, comma separated)
                      </label>
                      <input
                        type="text"
                        id="partnerPreferences.preferredMotherTongue"
                        name="partnerPreferences.preferredMotherTongue"
                        value={
                          formData.partnerPreferences.preferredMotherTongue
                        }
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="partnerPreferences.preferredEducation"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Preferred Education (optional, comma separated)
                      </label>
                      <input
                        type="text"
                        id="partnerPreferences.preferredEducation"
                        name="partnerPreferences.preferredEducation"
                        value={formData.partnerPreferences.preferredEducation}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="partnerPreferences.preferredOccupation"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Preferred Occupation (optional, comma separated)
                      </label>
                      <input
                        type="text"
                        id="partnerPreferences.preferredOccupation"
                        name="partnerPreferences.preferredOccupation"
                        value={formData.partnerPreferences.preferredOccupation}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="partnerPreferences.preferredLocation"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Preferred Location (optional, comma separated)
                      </label>
                      <input
                        type="text"
                        id="partnerPreferences.preferredLocation"
                        name="partnerPreferences.preferredLocation"
                        value={formData.partnerPreferences.preferredLocation}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Income Range (optional)
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          name="partnerPreferences.incomeRange.min"
                          value={formData.partnerPreferences.incomeRange.min}
                          onChange={handleInputChange}
                          placeholder="Min Income"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <input
                          type="text"
                          name="partnerPreferences.incomeRange.max"
                          value={formData.partnerPreferences.incomeRange.max}
                          onChange={handleInputChange}
                          placeholder="Max Income"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Preferred Height (optional)
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          name="partnerPreferences.preferredHeight.min"
                          value={
                            formData.partnerPreferences.preferredHeight.min
                          }
                          onChange={handleInputChange}
                          placeholder="Min Height"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <input
                          type="text"
                          name="partnerPreferences.preferredHeight.max"
                          value={
                            formData.partnerPreferences.preferredHeight.max
                          }
                          onChange={handleInputChange}
                          placeholder="Max Height"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="partnerPreferences.preferredLanguages"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Preferred Languages (optional, comma separated)
                      </label>
                      <input
                        type="text"
                        id="partnerPreferences.preferredLanguages"
                        name="partnerPreferences.preferredLanguages"
                        value={formData.partnerPreferences.preferredLanguages}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="partnerPreferences.culturalBackground"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cultural Background (optional, comma separated)
                    </label>
                    <input
                      type="text"
                      id="partnerPreferences.culturalBackground"
                      name="partnerPreferences.culturalBackground"
                      value={formData.partnerPreferences.culturalBackground}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Privacy Settings
                </h3>
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showEmail"
                        name="showEmail"
                        checked={formData.showEmail}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="showEmail"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Show Email (optional)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showMobile"
                        name="showMobile"
                        checked={formData.showMobile}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="showMobile"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Show Mobile (optional)
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="profileVisibility"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Profile Visibility (optional)
                      </label>
                      <select
                        id="profileVisibility"
                        name="profileVisibility"
                        value={formData.profileVisibility}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="Public">Public</option>
                        <option value="Member">Members Only</option>
                        <option value="Hidden">Hidden</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="photoVisibility"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Photo Visibility (optional)
                      </label>
                      <select
                        id="photoVisibility"
                        name="photoVisibility"
                        value={formData.photoVisibility}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="All">All</option>
                        <option value="Filtered">Filtered</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Registering..." : "Register Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;

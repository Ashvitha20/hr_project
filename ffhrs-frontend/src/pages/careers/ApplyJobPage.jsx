import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Typography,
  Alert,
  LinearProgress,
} from '@mui/material';

import { selectCurrentUser } from '../../features/auth/authSlice';
import { useSubmitApplication } from '../../features/applications/applicationQueries';
import { usePublicJob } from '../../features/jobs/jobQueries';
import { PageLoader } from '../../components/common/Loader';

import PersonalInfoStep from '../../components/applications/PersonalInfoStep';
import EducationStep from '../../components/applications/EducationStep';
import InternshipStep from '../../components/applications/InternshipStep';
import ExperienceStep from '../../components/applications/ExperienceStep';
import SkillsCertificationsStep from '../../components/applications/SkillsCertificationsStep';
import AdditionalQuestionsStep from '../../components/applications/AdditionalQuestionsStep';
import ResumeUploadStep from '../../components/applications/ResumeUploadStep';
import ReviewStep from '../../components/applications/ReviewStep';
import NotFoundPage from '../public/NotFoundPage';

// Job details are fetched from GET /jobs/:jobId — kept in sync with JobDetailPage
// since both now read from the same backend record.

const steps = [
  'Personal Info',
  'Education',
  'Internships',
  'Experience',
  'Skills & Certs',
  'Additional Questions',
  'Resume',
  'Review & Submit',
];

const educationEntrySchema = yup.object({
  qualification: yup.string().required('Qualification is required'),
  schoolName: yup.string(),
  collegeName: yup.string(),
  university: yup.string(),
  department: yup.string(),
  yearOfPassing: yup
    .string()
    .matches(/^(19|20)\d{2}$/, 'Enter a valid year')
    .required('Year of passing is required'),
  percentageOrCgpa: yup.string().required('Percentage / CGPA is required'),
});

const schema = yup.object({
  personalInfo: yup.object({
    fullName: yup.string().required('Full name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    phone: yup
      .string()
      .matches(/^[0-9+\-\s]{7,15}$/, 'Enter a valid phone number')
      .required('Phone number is required'),
    dob: yup.string().required('Date of birth is required'),
    gender: yup.string().required('Gender is required'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    country: yup.string().required('Country is required'),
    pinCode: yup
      .string()
      .matches(/^[0-9]{4,10}$/, 'Enter a valid PIN code')
      .required('PIN code is required'),
  }),
  education: yup.array().of(educationEntrySchema).min(1, 'Add at least one qualification'),
  internships: yup.array(),
  experience: yup.array(),
  skills: yup.array().min(1, 'Add at least one skill'),
  certifications: yup.array(),
  additionalInfo: yup.object({
    whyThisJob: yup.string().required('Please tell us why you want this job'),
    currentSalary: yup.string(),
    expectedSalary: yup.string().required('Expected salary is required'),
    noticePeriod: yup.string().required('Notice period is required'),
    currentLocation: yup.string().required('Current location is required'),
    preferredLocation: yup.string().required('Preferred location is required'),
    willingToRelocate: yup.string().required('Please answer this question'),
    priorInterviewWithCompany: yup.string().required('Please answer this question'),
    hasBondObligation: yup.string().required('Please answer this question'),
    comfortableWithShifts: yup.string().required('Please answer this question'),
    additionalNotes: yup.string(),
  }),
  resumeFile: yup.mixed().when('useExistingResume', {
  is: true,
  then: (s) => s.notRequired(),
  otherwise: (s) => s.required('Resume is required'),
}),
useExistingResume: yup.boolean(),
existingResumeUrl: yup.string(),
  coverLetterFile: yup.mixed(),
});

const defaultValues = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pinCode: '',
  },
  education: [
    {
      qualification: '',
      schoolName: '',
      collegeName: '',
      university: '',
      department: '',
      yearOfPassing: '',
      percentageOrCgpa: '',
    },
  ],
  internships: [],
  experience: [],
  skills: [],
  certifications: [],
  additionalInfo: {
    whyThisJob: '',
    currentSalary: '',
    expectedSalary: '',
    noticePeriod: '',
    currentLocation: '',
    preferredLocation: '',
    willingToRelocate: '',
    priorInterviewWithCompany: '',
    hasBondObligation: '',
    comfortableWithShifts: '',
    additionalNotes: '',
  },
  resumeFile: null,
  coverLetterFile: null,
};

// Fields validated per-step so "Next" only checks what's visible on that step.
const stepFieldMap = [
  ['personalInfo'],
  ['education'],
  ['internships'],
  ['experience'],
  ['skills', 'certifications'],
  ['additionalInfo'],
  ['resumeFile', 'coverLetterFile'],
  [],
];

export default function ApplyJobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const { data, isLoading, isError } = usePublicJob(jobId);
  const job = data?.data?.job;

  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: useMemo(
      () => ({
        ...defaultValues,
        personalInfo: {
          ...defaultValues.personalInfo,
          fullName: user?.name || '',
          email: user?.email || '',
        },
      }),
      [user]
    ),
    mode: 'onTouched',
  });

  const { mutateAsync, isPending } = useSubmitApplication();

  if (isLoading) return <PageLoader />;
  if (isError || !job) return <NotFoundPage />;

  const handleNext = async () => {
    const fieldsToValidate = stepFieldMap[activeStep];
    const isValid = fieldsToValidate.length ? await methods.trigger(fieldsToValidate) : true;
    if (isValid) setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (values) => {
    setSubmitError('');
    try {
      const { resumeFile, coverLetterFile, ...applicationData } = values;
      await mutateAsync({
        jobId: job.id,
        applicationData,
        resumeFile,
        coverLetterFile,
        onUploadProgress: setUploadProgress,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Could not submit your application. Please try again.');
    }
  };

  if (submitted) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 } }}>
        <Paper variant="outlined" sx={{ p: 5, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Application Submitted 🎉
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Thanks for applying to <strong>{job.title}</strong> at {job.company}. You can track its status anytime
            from your Candidate Portal.
          </Typography>
          <Button variant="contained" color="secondary" onClick={() => navigate('/candidate/applications')}>
            View My Applications
          </Button>
        </Paper>
      </Container>
    );
  }

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <PersonalInfoStep />;
      case 1:
        return <EducationStep />;
      case 2:
        return <InternshipStep />;
      case 3:
        return <ExperienceStep />;
      case 4:
        return <SkillsCertificationsStep />;
      case 5:
        return <AdditionalQuestionsStep />;
      case 6:
        return <ResumeUploadStep />;
      case 7:
        return <ReviewStep job={job} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
        Apply for {job.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {job.company} · {job.location}
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, overflowX: 'auto' }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3 }}>
        {submitError && <Alert severity="error" sx={{ mb: 3 }}>{submitError}</Alert>}
        {isPending && uploadProgress > 0 && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress variant="determinate" value={uploadProgress} color="secondary" />
          </Box>
        )}

        <FormProvider {...methods}>
          <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
            {renderStep()}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button disabled={activeStep === 0 || isPending} onClick={handleBack}>
                Back
              </Button>
              {activeStep < steps.length - 1 ? (
                <Button variant="contained" color="secondary" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit" variant="contained" color="secondary" disabled={isPending}>
                  {isPending ? 'Submitting…' : 'Submit Application'}
                </Button>
              )}
            </Box>
          </Box>
        </FormProvider>
      </Paper>
    </Container>
  );
}
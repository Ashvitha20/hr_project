import axiosClient from '../api/axiosClient';

/**
 * Application API layer.
 *
 * The multipart body sends one `payload` field containing the JSON-stringified
 * application data (personalInfo, education[], internships[], experience[],
 * skills[], certifications[], additionalInfo, jobId, useExistingResume) plus
 * the `resume` file (omitted when useExistingResume is true — the backend
 * falls back to the candidate's saved profile resume instead) and an
 * optional `coverLetter` file.
 */

/**
 * @param {string} jobId
 * @param {object} applicationData - form values minus resumeFile/coverLetterFile,
 *   including `useExistingResume` (bool) set by ResumeUploadStep.jsx
 * @param {File|null} resumeFile - null when useExistingResume is true
 * @param {File|null} coverLetterFile
 * @param {(percent: number) => void} [onUploadProgress]
 */
export async function submitApplication(
  jobId,
  applicationData,
  resumeFile,
  coverLetterFile,
  onUploadProgress
) {
  const { existingResumeUrl, ...restData } = applicationData;

  const formData = new FormData();
  formData.append('payload', JSON.stringify({ jobId, ...restData }));

  if (!restData.useExistingResume) {
    formData.append('resume', resumeFile);
  }
  if (coverLetterFile) {
    formData.append('coverLetter', coverLetterFile);
  }

  const { data } = await axiosClient.post('/applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onUploadProgress && evt.total) {
        onUploadProgress(Math.round((evt.loaded * 100) / evt.total));
      }
    },
  });
  return data;
}

export async function getMyApplications() {
  const { data } = await axiosClient.get('/candidates/me/applications');
  return data;
}

export async function getMyApplicationById(applicationId) {
  const { data } = await axiosClient.get(`/candidates/me/applications/${applicationId}`);
  return data;
}

export async function hasAppliedToJob(jobId) {
  const { data } = await axiosClient.get(`/candidates/me/applications/check/${jobId}`);
  return data;
}
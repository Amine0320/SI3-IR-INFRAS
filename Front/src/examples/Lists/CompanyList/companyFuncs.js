/**
 * Functions for handling companies list, saving, fetching, and toggling active/inactive status.
 * fetchActiveCompanies: fetches active companies and updates the state
 * fetchInactiveCompanies: fetches inactive companies and updates the state
 * handleSave: handles saving a new or edited company
 * handleToggleActiveInactive: toggles the active status of a company
 * handleCloseAlert: closes any alerts
 * handleSearchCompanies: searches companies by name or siret
 */
import CompanyService from 'services/Comapnies/CompanyService';

// Fetch active companies
export const fetchActiveCompanies = async (setCompanies, setAlert, setNoResultsMessage) => {
  const result = await CompanyService.getActiveCompanys();
  if (result.success) {
    setNoResultsMessage('');
    setCompanies(result.data);
    if (result.data.length === 0) {
      setNoResultsMessage('Aucun entreprise actif trouvé.');
    }
  } else {
    setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
    setNoResultsMessage(
      'Erreur lors de la récupération des entreprises. Veuillez réessayer plus tard.'
    );
  }
};
// Fetch inactive companies
export const fetchInactiveCompanies = async (setCompanies, setAlert, setNoResultsMessage) => {
  const result = await CompanyService.getInactiveCompanys();
  if (result.success) {
    setNoResultsMessage('');
    setCompanies(result.data);
    if (result.data.length === 0) {
      setNoResultsMessage('Aucune entreprise inactive trouvée.');
    }
  } else {
    setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
    setNoResultsMessage(
      'Erreur lors de la récupération des entreprises. Veuillez réessayer plus tard.'
    );
  }
};
// Toggle between active and inactive companies
export const handleToggleActiveInactive = (
  isActive,
  setIsActive,
  setCompanies,
  setAlert,
  setNoResultsMessage
) => {
  setIsActive(prevIsActive => {
    const newIsActive = !prevIsActive; // Toggle the active state
    // Fetch companies based on the new state
    if (newIsActive) {
      fetchActiveCompanies(setCompanies, setAlert, setNoResultsMessage);
    } else {
      fetchInactiveCompanies(setCompanies, setAlert, setNoResultsMessage);
    }
    return newIsActive; // Update the state
  });
};
// Handle save function for adding or editing a company
export const handleSave = async (
  data,
  selectedCompany,
  setAlert,
  handleModalClose,
  setIsActive,
  isActive,
  setCompanies,
  setNoResultsMessage
) => {
  let result;
  const successMessage = selectedCompany
    ? 'Entreprise mise à jour avec succès !'
    : 'Entreprise enregistrée avec succès !';

  if (selectedCompany) {
    setNoResultsMessage('');
    result = await CompanyService.updateCompany(selectedCompany.ENTid, data);
  } else {
    setNoResultsMessage('');
    result = await CompanyService.createCompany(data);
  }

  if (result.success) {
    setAlert({ show: true, message: successMessage, type: 'success' });
  } else {
    setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
  }

  handleModalClose();
  if (isActive) {
    fetchActiveCompanies(setCompanies, setAlert, setNoResultsMessage);
  } else {
    fetchInactiveCompanies(setCompanies, setAlert, setNoResultsMessage);
  }
  setIsActive(true);
  fetchActiveCompanies(setCompanies, setAlert, setNoResultsMessage);
};

// Close alert function
export const handleCloseAlert = (setAlert, timeout = 10000) => {
  const timer = setTimeout(() => {
    setAlert({ show: false, message: '', type: '' });
  }, timeout);
  return () => clearTimeout(timer);
};

/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from '../../largeStyles.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SiteDemracService from 'services/site_details/DR/DrService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import entityService from 'services/Entites/entityService';
const DrAddModal = ({ Sid, demrac, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    demrac || {
      gestionnaire_de_reseau: { nom: '' },
      Pro_fk: { nom: '' },
      no_devis: { ND: '' },
    }
  );
  const [activeDevis, setActiveDevis] = useState([]);
  const [activeProspects, setActivePropescts] = useState([]);
  const [activeEntites, setActiveEntites] = useState([]);
  const [isActive, setIsActive] = useState(demrac ? demrac.is_active : true);
  const [errors, setErrors] = useState({});
  const operators = ['SFR', 'ORANGE', 'FREE', 'Bouygues Telecom'];
  const handleChange = e => {
    const { name, value } = e.target;
    // Special handling for nested fields
    if (name === 'gestionnaire_de_reseau') {
      setFormData({ ...formData, gestionnaire_de_reseau: { nom: value } });
    } else if (name === 'no_devis') {
      setFormData({ ...formData, no_devis: { ND: value } });
    } else if (name === 'Pro_fk') {
      setFormData({ ...formData, Pro_fk: { nom: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  useEffect(() => {
    if (demrac) {
      setFormData({
        ...demrac,
        gestionnaire_de_reseau: demrac.gestionnaire_de_reseau || { nom: '' },
        Pro_fk: demrac.Pro_fk || { nom: '' },
        no_devis: demrac.no_devis || { ND: '' },
      });
      setIsActive(demrac.is_active);
    }
  }, [demrac]);
  //   fetch Active propsects
  useEffect(() => {
    const fetchActiveProspects = async Sid => {
      try {
        const result = await SiteDemracService.getActiveProspectsForDemrac(Sid);
        if (result.success) {
          setActivePropescts(result.data);
        } else {
          console.error('Error fetching active prospects:', result.error);
          setActivePropescts([]);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActivePropescts([]);
      }
    };
    fetchActiveProspects(Sid);
  }, []);
  //   fetch Active Entites
  useEffect(() => {
    const fetchActiveEntites = async () => {
      try {
        const result = await entityService.getActiveEntites();
        if (result.success) {
          setActiveEntites(result.data);
        } else {
          console.error('Error fetching active entites:', result.error);
          setActiveEntites([]);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveEntites([]);
      }
    };
    fetchActiveEntites();
  }, []);
  //  fetch Active Devis
  useEffect(() => {
    const fetchActiveDevis = async Sid => {
      try {
        const result = await SiteDemracService.getActiveDevisForDemrac(Sid);
        if (result.success) {
          setActiveDevis(result.data);
        } else {
          console.error('Error fetching active devis :', result.error);
          setActiveDevis([]);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveDevis([]);
      }
    };
    fetchActiveDevis(Sid);
  }, []);
  const validateForm = () => {
    const newErrors = {};
    // if (!formData.nom) newErrors.nom = true;
    return newErrors;
  };
  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const demracData = {
        NDRid: formData.NDRid,
        Ko_Dp: formData.Ko_Dp,
        date_dr: formData.date_dr,
        drdc: formData.drdc,
        type_rac: formData.type_rac,
        gestionnaire_de_reseau: formData.gestionnaire_de_reseau.nom,
        status_prop: formData.status_prop,
        no_devis: formData.no_devis.ND,
        Pro_fk: formData.Pro_fk.nom,
        is_active: isActive,
      };
      console.log('prospect data :', demracData);
      onSave({ Sid, demracData });
      return;
    }
    const demracData = {
      NDRid: formData.NDRid,
      Ko_Dp: formData.Ko_Dp,
      date_dr: formData.date_dr,
      drdc: formData.drdc,
      type_rac: formData.type_rac,
      gestionnaire_de_reseau: formData.gestionnaire_de_reseau.nom,
      status_prop: formData.status_prop,
      no_devis: formData.no_devis.ND,
      Pro_fk: formData.Pro_fk.nom,
      is_active: isActive,
    };
    onSave({ Sid, demracData });
  };
  const handleToggleActive = () => {
    setIsActive(!isActive);
  };
  const handleoperatorsChange = e => {
    const { value } = e.target;
    setFormData({ ...formData, operators: value });
  };
  const handleDropdownChange = (field, subField, value) => {
    setFormData({
      ...formData,
      [field]: { [subField]: value },
    });
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          Ajouter DR
        </MDTypography>
        <div className={styles.formGrid}>
          <MDInput
            name="NDRid"
            value={formData.NDRid || ''}
            onChange={handleChange}
            placeholder="Num DR*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />
          <FormControl
            fullWidth
            required
            style={{ marginBottom: '5px', marginTop: '10px', width: '320px' }}
          >
            <Select
              labelId="role-select-label"
              name="Pro_fk"
              value={formData.Pro_fk.nom || ''}
              displayEmpty
              onChange={e => handleDropdownChange('Pro_fk', 'nom', e.target.value)}
              style={{ padding: '12px', fontSize: '14px', borderColor: errors.Pro_fk ? 'red' : '' }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir un prospect --
              </MenuItem>
              {activeProspects.length > 0 ? (
                activeProspects.map(prospect => (
                  <MenuItem key={prospect.nom} value={prospect.Proid}>
                    {prospect.nom}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No active prospects available</MenuItem>
              )}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="KO DP "
              name="KO DP "
              value={formData.Ko_Dp ? dayjs(formData.Ko_Dp) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'Ko_Dp',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="DR Date"
              name="DR Date"
              value={formData.date_dr ? dayjs(formData.date_dr) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'date_dr',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Reception dossier complet"
              name="Reception dossier complet"
              value={formData.drdc ? dayjs(formData.drdc) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'drdc',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <FormControl
            fullWidth
            style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
            required
          >
            <Select
              name="type_rac"
              value={formData.type_rac || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.type_rac ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir le type de racc --
              </MenuItem>
              <MenuItem value="Simple">Simple</MenuItem>
              <MenuItem value="Complexe">Complexe</MenuItem>
              <MenuItem value="A Renseigner">A Renseigner</MenuItem>
            </Select>
          </FormControl>
          <FormControl style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}>
            <InputLabel id="operators-label">Operateurs</InputLabel>
            <Select
              labelId="operators-label"
              name="operators"
              multiple
              value={formData.operators || []}
              onChange={handleoperatorsChange}
              renderValue={selected => selected.join(', ')}
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.operators ? 'red' : '',
              }}
            >
              {operators.map(operateur => (
                <MenuItem key={operateur} value={operateur}>
                  <input
                    type="checkbox"
                    checked={formData.operators && formData.operators.includes(operateur)}
                    readOnly
                    style={{ marginRight: '100px', cursor: 'pointer' }}
                  />
                  <MDTypography variant="body2">{operateur}</MDTypography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            required
            style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
          >
            <Select
              labelId="role-select-label"
              name="gestionnaire_de_reseau"
              value={formData.gestionnaire_de_reseau.nom || ''}
              displayEmpty
              onChange={e => handleDropdownChange('gestionnaire_de_reseau', 'nom', e.target.value)}
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.gestionnaire_de_reseau ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir une entite --
              </MenuItem>
              {activeEntites.length > 0 ? (
                activeEntites.map(entite => (
                  <MenuItem key={entite.nom} value={entite.Eid}>
                    {entite.nom}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No active entites available</MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            required
            style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
          >
            <Select
              name="status_prop"
              value={formData.status_prop || ''}
              displayEmpty
              onChange={handleChange}
              style={{
                padding: '10px',
                fontSize: '14px',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir un statut --
              </MenuItem>
              <MenuItem value="Devis en attente">Devis en attente</MenuItem>
              <MenuItem value="Reçu">Reçu</MenuItem>
            </Select>
          </FormControl>
          <div>
            <InputLabel>{isActive ? 'Active' : 'Inactive'}</InputLabel>
            <Switch type="checkbox" checked={isActive} onChange={handleToggleActive}>
              {' '}
              {isActive ? 'Active' : 'Inactive'}
            </Switch>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <MDButton onClick={handleSubmit} variant="gradient" color="dark">
            Save
          </MDButton>
          <MDButton onClick={onClose} variant="gradient" color="dark">
            Fermer
          </MDButton>
        </div>
      </div>
    </div>
  );
};
DrAddModal.propTypes = {
  Sid: PropTypes.string.isRequired,
  demrac: PropTypes.shape({
    NDRid: PropTypes.string,
    Ko_Dp: PropTypes.string,
    date_dr: PropTypes.string,
    drdc: PropTypes.string,
    type_rac: PropTypes.string,
    operators: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
      .isRequired,
    gestionnaire_de_reseau: PropTypes.shape({
      nom: PropTypes.string.isRequired,
    }).isRequired,
    status_prop: PropTypes.string,
    no_devis: PropTypes.shape({
      ND: PropTypes.string.isRequired,
    }).isRequired,
    Pro_fk: PropTypes.shape({
      nom: PropTypes.string.isRequired,
    }).isRequired,
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default DrAddModal;

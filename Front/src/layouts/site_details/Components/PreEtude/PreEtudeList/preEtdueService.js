import { useEffect, useState } from 'react';
import SitePreEtudeService from 'services/site_details/PreEtude/preEtudeService';
import SiteProspectService from 'services/site_details/Prospect/prospectService';
import { useLocation } from 'react-router-dom';

const usePreEtudesForSite = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preEtudeData, setPreEtudeData] = useState([]);
  const location = useLocation();
  const { EB } = location.state || {};
  const siteId = EB;

  // Function to fetch preEtudes data
  const fetchPreEtudeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch prospects for the site
      const prospectsResponse = await SiteProspectService.getProspectsSite(siteId);
      if (!prospectsResponse.success) {
        throw new Error(`Failed to fetch prospects for site ID: ${siteId}`);
      }
      const prospects = prospectsResponse.data;

      // Create a lookup table for prospects by ID
      const prospectLookup = prospects.reduce((acc, prospect) => {
        acc[prospect.id] = prospect.nom; // Assuming 'id' is the unique key for prospects
        return acc;
      }, {});

      // Fetch preÉtudes for the site
      const preEtudesResponse = await SitePreEtudeService.getPreEtudesSite(siteId);
      if (!preEtudesResponse.success) throw new Error('Failed to fetch preÉtudes');
      const preEtudes = preEtudesResponse.data;

      // Enrich preÉtudes with prospect names using the lookup table
      const enrichedPreEtudes = preEtudes.map(preEtude => ({
        ...preEtude,
        prospectName: prospectLookup[preEtude.prospectId] || 'Unknown', // Match by prospectId
      }));

      // Set the preÉtude data with prospect names included
      setPreEtudeData(enrichedPreEtudes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Initial fetch when siteId changes
  useEffect(() => {
    if (siteId) {
      fetchPreEtudeData();
    }
  }, [siteId]);

  return { preEtudeData, loading, error, fetchPreEtudeData };
};

export default usePreEtudesForSite;

import { NextRequest, NextResponse } from 'next/server';
import { DATASETS_LIST } from '@/lib/serverDatasets';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const found = DATASETS_LIST.find(
    d => d.id.toLowerCase() === decodedId.toLowerCase() ||
         d.product_id.toLowerCase() === decodedId.toLowerCase()
  );

  if (!found) {
    return NextResponse.json({ error: 'Metadata not found' }, { status: 404 });
  }

  const pds4 = found.pds4_metadata || {
    logical_identifier: `urn:isro:isda:ch2:${found.instrument.toLowerCase()}:${found.id}`,
    version_id: '1.0',
    product_class: 'Product_Observational',
    target_name: 'Moon',
    mission_phase: 'Primary Science Phase',
    instrument_host_name: 'Chandrayaan-2 Orbiter',
    instrument_name: `${found.instrument} Optical Instrument`,
    spacecraft_clock_start: '611204500.10',
    spacecraft_clock_stop: '611204522.40',
    incidence_angle_deg: 90 - found.sun_elevation,
    emission_angle_deg: 2.1,
    phase_angle_deg: 65.0,
    sub_solar_azimuth: found.sun_azimuth,
    sub_solar_elevation: found.sun_elevation,
    radiometric_calibration: 'CALIBRATED_L2',
    filter_wavelength: found.instrument === 'OHRC' ? 'Panchromatic (450 - 900 nm)' : found.instrument === 'TMC-2' ? 'Panchromatic (500 - 850 nm)' : 'Hyperspectral (0.8 - 5.0 µm, 256 bands)',
  };

  const xmlLabel = `<?xml version="1.0" encoding="UTF-8"?>
<Product_Observational xmlns="http://pds.nasa.gov/pds4/pds/v1"
    xmlns:isro="http://isda.isro.gov.in/pds4/isro/v1">
  <Identification_Area>
    <logical_identifier>${pds4.logical_identifier}</logical_identifier>
    <version_id>${pds4.version_id}</version_id>
    <title>${found.title}</title>
    <information_model_version>1.16.0.0</information_model_version>
    <product_class>${pds4.product_class}</product_class>
  </Identification_Area>
  <Observation_Area>
    <Time_Coordinates>
      <start_date_time>${found.acquisition}</start_date_time>
      <stop_date_time>${found.acquisition}</stop_date_time>
    </Time_Coordinates>
    <Primary_Result_Summary>
      <purpose>Science</purpose>
      <processing_level>Calibrated</processing_level>
    </Primary_Result_Summary>
    <Investigation_Area>
      <name>Chandrayaan-2</name>
      <type>Mission</type>
    </Investigation_Area>
    <Observing_System>
      <Observing_System_Component>
        <name>${pds4.instrument_host_name}</name>
        <type>Host</type>
      </Observing_System_Component>
      <Observing_System_Component>
        <name>${pds4.instrument_name}</name>
        <type>Instrument</type>
      </Observing_System_Component>
    </Observing_System>
    <Target_Identification>
      <name>${pds4.target_name}</name>
      <type>Satellite</type>
    </Target_Identification>
    <Discipline_Area>
      <Geometry>
        <Solar_Geometry>
          <incidence_angle unit="deg">${pds4.incidence_angle_deg}</incidence_angle>
          <emission_angle unit="deg">${pds4.emission_angle_deg}</emission_angle>
          <phase_angle unit="deg">${pds4.phase_angle_deg}</phase_angle>
          <sub_solar_azimuth unit="deg">${pds4.sub_solar_azimuth}</sub_solar_azimuth>
          <sub_solar_elevation unit="deg">${pds4.sub_solar_elevation}</sub_solar_elevation>
        </Solar_Geometry>
      </Geometry>
    </Discipline_Area>
  </Observation_Area>
  <File_Area_Observational>
    <File>
      <file_name>${found.id}.png</file_name>
      <file_size unit="byte">${found.file_size_kb * 1024}</file_size>
    </File>
    <Array_2D_Image>
      <offset unit="byte">0</offset>
      <axes>2</axes>
      <axis_index_order>Last_Index_Fastest</axis_index_order>
      <Element_Array>
        <data_type>UnsignedByte</data_type>
      </Element_Array>
      <Axis_Array>
        <axis_name>Line</axis_name>
        <elements>${found.height}</elements>
        <sequence_number>1</sequence_number>
      </Axis_Array>
      <Axis_Array>
        <axis_name>Sample</axis_name>
        <elements>${found.width}</elements>
        <sequence_number>2</sequence_number>
      </Axis_Array>
    </Array_2D_Image>
  </File_Area_Observational>
</Product_Observational>`;

  return NextResponse.json({
    product_id: found.id,
    title: found.title,
    instrument: found.instrument,
    acquisition_time: found.acquisition,
    coordinates: {
      latitude: found.lat,
      longitude: found.lon,
      region_name: found.region,
    },
    resolution_gsd_m: found.gsd_m,
    sun_geometry: {
      solar_elevation_deg: found.sun_elevation,
      solar_azimuth_deg: found.sun_azimuth,
      incidence_angle_deg: pds4.incidence_angle_deg,
      emission_angle_deg: pds4.emission_angle_deg,
      phase_angle_deg: pds4.phase_angle_deg,
    },
    raster_dimensions: {
      width_px: found.width,
      height_px: found.height,
      file_size_kb: found.file_size_kb,
    },
    pds4_logical_identifier: pds4.logical_identifier,
    radiometric_calibration: pds4.radiometric_calibration,
    filter_band: pds4.filter_wavelength,
    xml_label: xmlLabel,
  });
}

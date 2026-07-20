const profileButton = document.querySelector('#profileButton');
const profileMenu = document.querySelector('#profileMenu');
const homeHref = `${window.location.origin}/`;
const sectionTabs = document.querySelector('#sectionTabs');
const sectionTitle = document.querySelector('#sectionTitle');
const sectionBody = document.querySelector('#sectionBody');
const commonDetailsSectionId = 'common_form';
let toastTimer;
let activeSectionId = commonDetailsSectionId;
let activePhaseBySection = {
  [commonDetailsSectionId]: '0 Phase',
  work_start_up_inspection: '0 Phase',
  first_phase_observation_sheet: '0 Phase',
  operation_durability_cycles: '0 Phase',
  corrosion_coupon_measurement: '0 Phase',
  scribe_line_measurement: '0 Phase',
  crs_check_sheet: '0 Phase',
  dismantling_inspection: '0 Phase',
  photo_annexure: '0 Phase'
};
const STORAGE_KEY = 'rustEnduranceMicModelAdditionStateV2';
let persistedState = loadState();

if (persistedState.activePhaseBySection) {
  activePhaseBySection = { ...activePhaseBySection, ...persistedState.activePhaseBySection };
}

const phaseOptions = ['0 Phase', '0.5 Phase', '1 Phase', '2 Phase', '3 Phase', '4 Phase', '5 Phase', '6 Phase', '7 Phase', '8 Phase', '9 Phase', '10 Phase', '11 Phase', '12 Phase'];
const phaseObservationRows = Array.from({ length: 13 }, (_, index) => `Phase ${index}`);
const phaseObservationCriteriaOptions = Array.from({ length: 8 }, (_, index) => String(index + 3));
const bodyPanels = ['Hood', 'Front fender', 'Front door', 'Rear door', 'Quarter panel', 'Back door', 'Roof'];
const scribeDirections = ['Left: V', 'Left: H', 'Right: V', 'Right: H'];
const crsInspectionPhases = ['0', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const crsDocumentTitle = 'SES T 6561 Corrosion resistance test, appearance and function inspection sheet';
const crsDocumentFields = [
  ['printDate', 'Print date'],
  ['userId', 'User ID'],
  ['sheetTitle', 'Sheet title'],
  ['dateOfImplementation', 'Date of implementation'],
  ['pageNumber', 'Page number'],
  ['model', 'Model'],
  ['prototypeStage', 'Prototype stage'],
  ['temporarySymbol', 'Temporary symbol']
];
const crsSharedInspectionFields = [
  ['inspectionDay', 'Inspection day'],
  ['inspectedBy', 'Inspected by'],
  ['filmThicknessBefore', 'Film Thickness Before'],
  ['filmThicknessAfter', 'Film Thickness After'],
  ['remark', 'Remark']
];
const createEmptyInspectionValues = () => ({
  "0": "",
  "1/2": "",
  "1": "",
  "2": "",
  "3": "",
  "4": "",
  "5": "",
  "6": "",
  "7": "",
  "8": "",
  "9": "",
  "10": "",
  "11": "",
  "12": ""
});
const normalizeInspectionRow = (row = {}) => ({
  id: row.id || "",
  sectionNumber: row.sectionNumber || "",
  sectionName: row.sectionName || "",
  itemName: row.itemName || "",
  subItemName: row.subItemName || "",
  position: row.position || "",
  side: row.side || "",
  filmThicknessApplicable: row.filmThicknessApplicable ?? false,
  filmThicknessBefore: row.filmThicknessBefore ?? "",
  filmThicknessAfter: row.filmThicknessAfter ?? "",
  inspectionValues: {
    ...createEmptyInspectionValues(),
    ...(row.inspectionValues || {})
  },
  remark: row.remark ?? ""
});
const crsRow = ({ id, sectionNumber = '', sectionName, itemName, subItemName = '', position = '', side = '', filmThicknessApplicable = false }) => normalizeInspectionRow({
  id,
  sectionNumber,
  sectionName,
  itemName,
  subItemName,
  position,
  side,
  filmThicknessApplicable,
  inspectionValues: createEmptyInspectionValues(),
  remark: ''
});
const crsRowsForItems = (sectionNumber, sectionName, items) => items.map(([id, itemName, extra = {}]) => crsRow({ id, sectionNumber, sectionName, itemName, ...extra }));
const crsDoorPositions = [
  { position: 'Front door', side: 'L' },
  { position: 'Front door', side: 'R' },
  { position: 'Rear door', side: 'L' },
  { position: 'Rear door', side: 'R' },
  { position: 'Back door/Trunk', side: '' }
];
const crsDoorRows = (items) => items.flatMap(([id, itemName]) => crsDoorPositions.map(({ position, side }) => crsRow({
  id: `${id}${position.replace(/[^A-Za-z0-9]/g, '')}${side}`,
  sectionNumber: '8',
  sectionName: 'Door panel',
  itemName,
  position,
  side
})));
const crsRows = [
  crsRow({ id: 'roofPanel', sectionNumber: '1', sectionName: 'Roof panel', itemName: 'Roof panel' }),
  ...crsRowsForItems('2', 'Side body panel', [['sideBodyPanelOpeningTrim', 'Opening trim'], ['sideBodyPanelPanel', 'Panel'], ['fuelLidHinge', 'Fuel lid hinge'], ['fuelLidMountingBolts', 'Fuel lid mounting bolts'], ['fuelLidSpring', 'Fuel lid spring'], ['fuelFillerNeck', 'Fuel filler neck'], ['fuelFillerNeckMountingBoltsAndNuts', 'Fuel filler neck mounting bolts & nuts'], ['molding', 'Molding'], ['sideDoorGuideRail', 'Side door guide rail'], ['matchingPortionWithFuelLidBox', 'Matching portion with fuel lid box']]),
  ...crsRowsForItems('3', 'Pillar panel', [['pillarPanel', 'Pillar panel'], ['pillarPatchingPortion', 'Pillar patching portion']]),
  ...crsRowsForItems('4', 'Fender panel', [['fenderPanelOpeningTrim', 'Opening trim'], ['fenderPanelPanel', 'Panel'], ['fenderPanelMountingBolts', 'Fender panel mounting bolts'], ['fenderMatchingPortionWithInnerPanel', 'Matching portion with inner panel']]),
  ...crsRowsForItems('5', 'Front hood panel', [['frontHoodOuterSide', 'Outer side'], ['frontHoodInnerSide', 'Inner side'], ['frontHoodMatchingPortionWithInnerPanel', 'Matching portion with inner panel'], ['frontHoodHingeMountingPortion', 'Hinge mounting portion'], ['frontHoodHingeMountingBolts', 'Hinge mounting bolts'], ['frontHoodLock', 'Lock'], ['frontHoodStriker', 'Striker'], ['frontHoodLockAndStrikerMountingBolts', 'Lock & striker mounting bolts']]),
  crsRow({ id: 'sideSillPanel', sectionNumber: '6', sectionName: 'Side sill panel', itemName: 'Side sill panel' }),
  ...crsRowsForItems('7', 'Skirt panel', [['skirtPanelFront', 'Front'], ['skirtPanelRear', 'Rear'], ['skirtPanelMountingBolts', 'Skirt panel mounting bolts']]),
  ...crsDoorRows([['doorPanel', 'Door panel'], ['doorMatchingWithInnerPanel', 'Matching with inner panel'], ['doorSash', 'Door sash'], ['doorMatchingWithHinge', 'Matching with hinge'], ['hingeArmMountingPortion', 'Hinge arm mounting portion'], ['hingeArmMountingBoltsAndPins', 'Hinge arm mounting bolts, pins'], ['outsideHandleOrButton', 'Outside handle or button'], ['doorLock', 'Door lock'], ['doorLockStriker', 'Door lock striker'], ['doorLockStrikerMountingBolts', 'Door lock striker mounting bolts']]),
  crsRow({ id: 'cowlTopPanel', sectionNumber: '9', sectionName: 'Cowl top panel', itemName: 'Cowl top panel' }),
  crsRow({ id: 'frontPanel', sectionNumber: '10', sectionName: 'Front panel', itemName: 'Front panel' }),
  ...crsRowsForItems('11', 'Bumper', [['frontBumper', 'Bumper - Front', { position: 'Front' }], ['rearBumper', 'Bumper - Rear', { position: 'Rear' }], ['frontBumperMountingBolts', 'Mounting bolts - Front', { position: 'Front' }], ['rearBumperMountingBolts', 'Mounting bolts - Rear', { position: 'Rear' }]]),
  ...crsRowsForItems('12', 'Rust in the cabin', [['seatRail', 'Seat rail'], ['seatRailMountingBolts', 'Seat rail mounting bolts'], ['recliningLeverAndPin', 'Reclining lever & pin'], ['sideBrakeLever', 'Side brake lever'], ['sideBrakeLeverMountingBolts', 'Side brake lever mounting bolts'], ['changeCoverTighteningBolts', 'Change cover tightening bolts'], ['changeShaft', 'Change shaft'], ['steeringShaft', 'Steering shaft'], ['floor', 'Floor']]),
  ...crsRowsForItems('13', 'Wheel', [['frontWheelSteelOrAluminium', 'Front wheel - steel/aluminium', { position: 'Front' }], ['rearWheelSteelOrAluminium', 'Rear wheel - steel/aluminium', { position: 'Rear' }]]),
  crsRow({ id: 'wheelNuts', sectionNumber: '14', sectionName: 'Wheel nuts', itemName: 'Wheel nuts' }),
  crsRow({ id: 'lampMountingScrew', sectionNumber: '15', sectionName: 'Lamp etc. mounting screw', itemName: 'Lamp etc. mounting screw' }),
  crsRow({ id: 'outsideMirror', sectionNumber: '16', sectionName: 'Outside mirror', itemName: 'Outside mirror' }),
  crsRow({ id: 'frontWiper', sectionNumber: '17', sectionName: 'Front wiper', itemName: 'Front wiper' }),
  crsRow({ id: 'rearWiper', sectionNumber: '18', sectionName: 'Rear wiper', itemName: 'Rear wiper' }),
  crsRow({ id: 'headLampRimRetainer', sectionNumber: '19', sectionName: 'Head lamp rim (retainer)', itemName: 'Head lamp rim (retainer)' }),
  crsRow({ id: 'frontBrake', sectionNumber: '20', sectionName: 'Front brake', itemName: 'Front brake' }),
  crsRow({ id: 'rearBrake', sectionNumber: '21', sectionName: 'Rear brake', itemName: 'Rear brake' }),
  ...crsRowsForItems('', 'Inside engine room', [['engineCylinder', 'Cylinder'], ['engineCylinderHead', 'Cylinder head'], ['engineHeadCover', 'Head cover'], ['engineOilPan', 'Oil pan'], ['engineAirCleaner', 'Air cleaner'], ['engineRadiator', 'Radiator'], ['engineThrottleBody', 'Throttle body'], ['engineSteelPipe', 'Steel pipe etc.'], ['engineWireHarnessCoupler', 'Wire harness coupler'], ['engineBattery', 'Battery'], ['engineClutchArm', 'Clutch arm'], ['engineClamp', 'Clamp etc.'], ['engineTighteningBoltsAndNuts', 'Tightening bolts & nuts']]),
  ...crsRowsForItems('', 'Under floor', [['underFloorFuelTank', 'Fuel tank'], ['underFloorBody', 'Under floor'], ['mufflerAndExhaustPipe', 'Muffler, exhaust pipe'], ['chassisFrame', 'Chassis frame'], ['axle', 'Axle'], ['frontWheelHub', 'Front wheel hub'], ['leafSpring', 'Leaf spring'], ['absorberOrStrut', 'Absorber, strut'], ['coilSpring', 'Coil spring'], ['stabilizer', 'Stabilizer'], ['driveShaft', 'Drive shaft'], ['differentialCase', 'Differential case'], ['steeringAndLinkage', 'Steering, linkage'], ['fuelPipe', 'Fuel pipe'], ['brakePipe', 'Brake pipe'], ['knuckleArm', 'Knuckle arm'], ['propellerShaft', 'Propeller shaft'], ['underFloorWireHarnessCoupler', 'Wire harness coupler etc.'], ['compressor', 'Compressor'], ['alternator', 'Alternator'], ['starter', 'Starter']]),
  ...crsRowsForItems('', 'Insulation / removal', [['tireWheelInsulationRemoval', 'Tire wheel insulation/removal'], ['softTopInsulationRemoval', 'Soft top insulation/removal']]),
  ...crsRowsForItems('', 'Hybrid / electric vehicle', [['driveMotor', 'Drive motor'], ['generator', 'Generator'], ['driveBattery', 'Drive battery'], ['inverter', 'Inverter'], ['junctionBox', 'Junction box'], ['batteryCharger', 'Battery charger'], ['dcDcConverter', 'DC/DC converter'], ['controller', 'Controller'], ['highVoltageHarnessOrCoupler', 'High-voltage harness/coupler'], ['coolingFan', 'Cooling fan'], ['coolingWaterPump', 'Cooling water pump'], ['chargingLid', 'Charging lid'], ['quickChargerConnector', 'Quick charger connector'], ['normalChargerConnector', 'Normal charger connector']]),
  crsRow({ id: 'systemWarningLampOnInspection', sectionName: 'System inspection', itemName: 'System warning lamp ON inspection' }),
  crsRow({ id: 'highVoltageSystemInsulationResistance', sectionName: 'System inspection', itemName: 'Insulation resistance of high-voltage system', subItemName: 'Unit: MΩ' })
];
const crsEarthResistanceDefaults = {
  earthResistanceMeasurement: "",
  earthResistanceUnit: "mΩ",
  earthResistanceStandardValue: "",
  earthResistanceRanges: [
    { from: "", to: "", value: "" },
    { from: "", to: "", value: "" },
    { from: "", to: "", value: "" },
    { from: "", to: "", value: "" }
  ]
};
const dismantlingRows = [
  ['Front hood', 'Front hood', ''],
  ['Door', 'Front', 'L'],
  ['Door', 'Front', 'R'],
  ['Door', 'Rear', 'L'],
  ['Door', 'Rear', 'R'],
  ['Door', 'Back', ''],
  ['Trunk lid', 'Trunk lid', ''],
  ['Cross member', 'Front', ''],
  ['Cross member', 'Rear floor', ''],
  ['Member', 'Front side (portions which mount suspension arm)', 'L'],
  ['Member', 'Front side (portions which mount suspension arm)', 'R'],
  ['Member', 'Floor side', 'L'],
  ['Member', 'Floor side', 'R'],
  ['Member', 'Rear floor side', 'L'],
  ['Member', 'Rear floor side', 'R'],
  ['Member', 'Back panel upper', ''],
  ['Pillar', 'Front', 'L'],
  ['Pillar', 'Front', 'R'],
  ['Pillar', 'Center', 'L'],
  ['Pillar', 'Center', 'R'],
  ['Pillar', 'Rear', 'L'],
  ['Pillar', 'Rear', 'R'],
  ['Door hinge', 'Front', 'L'],
  ['Door hinge', 'Front', 'R'],
  ['Door hinge', 'Rear', 'L'],
  ['Door hinge', 'Rear', 'R'],
  ['Side sill', 'Left', ''],
  ['Side sill', 'Right', ''],
  ['Roof side rail', 'Left', ''],
  ['Roof side rail', 'Right', ''],
  ['Frame, rear suspension', 'Frame, rear suspension', ''],
  ['Housing, rear combination', 'Housing, rear combination', ''],
  ['Fuel tank', 'Fuel tank', ''],
  ['Off road car - frame assy', 'Frame assy', ''],
  ['Off road car - member', 'Front panel', ''],
  ['Off road car - member', 'Rear floor tale', ''],
  ['Off road car - member', 'Center floor', ''],
  ['Off road car - member', 'Front side', 'L'],
  ['Off road car - member', 'Front side', 'R'],
  ['Off road car', 'Panel, soft top attachment', ''],
  ['Cab over type - panel', 'Front', ''],
  ['Cab over type - panel', 'Tale skirt', ''],
  ['Cab over type - panel', 'Rear floor upper', ''],
  ['Cab over type - panel', 'Quarter', 'L'],
  ['Cab over type - panel', 'Quarter', 'R'],
  ['Cab over type - panel', 'Slide rail', 'L'],
  ['Cab over type - panel', 'Slide rail', 'R'],
  ['Cab over type - member', 'Rear seat leg', ''],
  ['Cab over type - member', 'Engine service hole, rear', ''],
  ['Cab over type - member', 'Front floor', 'L'],
  ['Cab over type - member', 'Front floor', 'R'],
  ['Front suspension arm ball joint', 'Front suspension arm ball joint', ''],
  ['Remarks', 'Remarks', '']
];
const legacyRadioCell = () => ({ type: 'legacy-radio' });
const emptyCell = () => ({ type: 'empty' });
const inputCell = (value = '', label = 'Editable table cell') => ({ type: 'input', value, label });
const uploadCell = (label = 'Photo upload') => ({ type: 'upload', label });
const couponMeasurementLabels = [
  'initial check date',
  'initial weight',
  'final check date',
  'final weight',
  'weight loss',
  'rust progress'
];
const couponRow = (categoryCell, couponNo, runningDay = '', measurements = []) => [
  legacyRadioCell(),
  categoryCell,
  inputCell(couponNo, `Coupon ${couponNo} number`),
  inputCell(runningDay, `Coupon ${couponNo} running day`),
  ...couponMeasurementLabels.map((label, index) => (
    inputCell(measurements[index] ?? '', `Coupon ${couponNo} ${label}`)
  ))
];

const localDetailFields = [
  { type: 'input', label: 'Model Code:', name: 'modelCode' },
  { type: 'input', label: 'Chassis No', name: 'chassisNo' },
  { type: 'input', label: 'Temp Symbol:', name: 'tempSymbol' },
  { type: 'select', label: 'Location', name: 'location', options: ['Lab A', 'Lab B', 'Chamber 2'] },
  { type: 'select', label: 'Test Type:', name: 'testTypePrimary', options: ['Cyclic corrosion', 'Salt spray', 'Humidity'] },
  { type: 'input', label: 'Test Type:', name: 'testTypeSecondary' },
  { type: 'dual-select', label: 'Trail:', name: 'trial', optionsA: ['T1', 'T2', 'P1'], optionsB: ['Phase 1', 'Phase 2', 'Phase 3'] },
  { type: 'select', label: 'Applicable checksheet', name: 'applicableChecksheet', options: ['Work Start up Inspection', '1st phase observation sheet', 'CRS check sheet'] },
  { type: 'input', label: 'Remarks', name: 'remarks' },
  { type: 'select', label: 'Phases:', name: 'phase', options: phaseOptions }
];

const sharedDetailFields = [
  { type: 'input', label: 'Model Code:', name: 'modelCode', required: true },
  { type: 'input', label: 'Chassis No', name: 'chassisNo', required: true },
  { type: 'input', label: 'Temp Symbol:', name: 'tempSymbol' },
  { type: 'select', label: 'Location', name: 'location', options: ['Lab A', 'Lab B', 'Chamber 2'], required: true },
  { type: 'select', label: 'Test Type:', name: 'testTypePrimary', options: ['Cyclic corrosion', 'Salt spray', 'Humidity'] },
  { type: 'input', label: 'Test Type:', name: 'testTypeSecondary' },
  { type: 'dual-select', label: 'Trial:', name: 'trial', optionsA: ['T1', 'T2', 'P1'], optionsB: ['Phase 1', 'Phase 2', 'Phase 3'] },
  { type: 'input', label: 'Remarks', name: 'remarks' },
  { type: 'select', label: 'Phases:', name: 'phase', options: phaseOptions, phaseControlled: true, required: true }
];

const sections = {
  work_start_up_inspection: {
    title: 'Work Start up Inspection',
    preserveLocal: true,
    legacyTable: true,
    columns: ['Applicable', 'Sl No.', 'Category', 'Check points'],
    rows: [
      [legacyRadioCell(), '1', 'Water pump belt or', 'Crack, damage'],
      [legacyRadioCell(), '2', 'Alternator belt', 'Tension'],
      [legacyRadioCell(), '3', 'Engine oil', 'Leak'],
      [legacyRadioCell(), '4', 'Coolant', 'Leak'],
      [
        legacyRadioCell(),
        '5',
        { text: 'Battery\nAuxiliary battery (electric vehicle, hybrid electric vehicle)', className: 'multiline-cell' },
        { text: 'Check 1  Leak\nCheck 2  Fluid level\nCheck 3  Terminal voltage (electric vehicle, hybrid electric vehicle) (     ) V', className: 'multiline-cell' }
      ],
      [legacyRadioCell(), '6', 'Fuel', 'Leak'],
      [
        legacyRadioCell(),
        '7',
        'Brake',
        {
          text: 'Check 1  Leak\nCheck 2  Parking brake lever pulling stroke (     ) teeth\nCheck 3  Foot brake pedal stroke allowance when treading to end (     ) mm\nCheck 4  Foot brake pedal end play stroke 1–8 mm\nCheck 5  Fluid level',
          className: 'multiline-cell'
        }
      ],
      [
        legacyRadioCell(),
        '8',
        'Electric vacuum pump (electric vehicle, hybrid electric vehicle)',
        'Operation'
      ],
      [legacyRadioCell(), '9', 'Gear oil', 'Leak'],
      [legacyRadioCell(), '10', 'Clutch', 'Play at pedal tip'],
      [
        legacyRadioCell(),
        '11',
        'Tire',
        { text: 'Check 1  Abnormal wear, damage\nCheck 2  Air pressure', className: 'multiline-cell' }
      ],
      [legacyRadioCell(), '12', 'Exhaust gas', 'Leak, smoke color, smoke volume'],
      [
        legacyRadioCell(),
        '13',
        'Steering',
        { text: 'Check 1  Looseness, noise, abnormal heaviness during operation\nCheck 2  Play', className: 'multiline-cell' }
      ],
      [legacyRadioCell(), '14', 'Door lock, hood lock', 'Operation'],
      [legacyRadioCell(), '15', 'Mirror, sun visor', 'Operation, retention'],
      [legacyRadioCell(), '16', 'Seatbelt', 'Operation'],
      [legacyRadioCell(), '17', 'Warning lamps lighting', 'OK/NG']
    ]
  },
  first_phase_observation_sheet: {
    title: '1st phase observation sheet',
    preserveLocal: true,
    legacyTable: true,
    columns: ['Applicable', 'Sl No.', 'Observation', 'Criteria', 'Actual', 'Attachment'],
    phaseSheet: 'phase-observation'
  },
  operation_durability_cycles: {
    title: 'Operation Durability Cycles',
    preserveLocal: true,
    legacyTable: true,
    columns: ['Applicable', 'Sl No.', 'Category', 'Check points'],
    rows: [
      [legacyRadioCell(), '1', 'Front door outside handle', 'Open/Close'],
      [legacyRadioCell(), '2', 'Front door inside handle', 'Open/Close'],
      [legacyRadioCell(), '3', 'Front door regulator', 'Open/Close'],
      [legacyRadioCell(), '4', 'Front door inside lock', 'Lock/Free'],
      [legacyRadioCell(), '5', 'Front door key', 'Lock/Free'],
      [legacyRadioCell(), '6', 'Outside mirror (body side)', '90° operation'],
      [legacyRadioCell(), '7', 'Outside mirror (mirror side)', 'Up/Down/Left/Right'],
      [legacyRadioCell(), '8', 'Front seat', 'Installation/Removal'],
      [legacyRadioCell(), '9', 'Rear door outside handle', 'Open/Close'],
      [legacyRadioCell(), '10', 'Rear door inside handle', 'Open/Close'],
      [legacyRadioCell(), '11', 'Rear door regulator', 'Open/Close'],
      [legacyRadioCell(), '12', 'Rear door inside lock', 'Lock/Free'],
      [legacyRadioCell(), '13', 'Quarter window', 'Open/Close'],
      [legacyRadioCell(), '14', 'Back door outside handle', 'Open/Close'],
      [legacyRadioCell(), '15', 'Back door opener', 'Open/Close'],
      [legacyRadioCell(), '16', 'Back door window fastener', 'Open/Close'],
      [legacyRadioCell(), '17', 'Back door key', 'Lock/Free'],
      [legacyRadioCell(), '18', 'Trunk lid key', 'Lock/Free'],
      [legacyRadioCell(), '19', 'Side gate', 'Open/Close'],
      [legacyRadioCell(), '20', 'Rear gate', 'Open/Close'],
      [legacyRadioCell(), '21', 'Front hood', 'Open/Close'],
      [legacyRadioCell(), '22', 'Engine oil level gauge', 'Installation/Removal'],
      [legacyRadioCell(), '23', 'Radiator cap', 'Installation/Removal'],
      [legacyRadioCell(), '24', 'Radio antenna', ''],
      [legacyRadioCell(), '25', 'Fuel inlet lid', 'Open/Close'],
      [legacyRadioCell(), '26', 'Fuel tank cap', 'Installation/Removal'],
      [legacyRadioCell(), '27', 'Trunk lid opener', 'Open/Close'],
      [legacyRadioCell(), '28', 'Rear gate inside lock', 'Open/Close'],
      [legacyRadioCell(), '29', 'Electric remote control mirror', 'Up/Down/Left/Right'],
      [legacyRadioCell(), '30', 'Electric back door lock switch', 'Lock/Free'],
      [legacyRadioCell(), '31', 'Electric door inside lock', 'Lock/Free'],
      [legacyRadioCell(), '32', 'Power window', 'Open/Close'],
      [legacyRadioCell(), '33', 'Sun roof', 'Open/Close'],
      [legacyRadioCell(), '34', 'Sun roof', 'Installation/Removal'],
      [legacyRadioCell(), '35', 'Charging lid', 'Open/Close']
    ]
  },
  corrosion_coupon_measurement: {
    title: 'Corrosion Coupon data measurement',
    preserveLocal: true,
    legacyTable: true,
    columns: ['Applicable', 'Category', 'Coupon no.', 'Running Day', 'Initial check date', 'Initial weight', 'Final Check Date', 'Final Weight', 'Weight Loss', 'Rust Progress (µm)'],
    rows: [
      couponRow({ text: 'Underbody', rowSpan: 10, className: 'group-label' }, '1', '5th'),
      couponRow(emptyCell(), '2', '6th'),
      couponRow(emptyCell(), '3', '7th'),
      couponRow(emptyCell(), '4', '8th'),
      couponRow(emptyCell(), '5', '9th'),
      couponRow(emptyCell(), '6', '10th'),
      couponRow(emptyCell(), '7', '11th'),
      couponRow(emptyCell(), '8', '12th'),
      couponRow(emptyCell(), '9', '13th', ['14.01.2025', 'o', 'o', 'o', 'o', 'o']),
      couponRow(emptyCell(), '10', '14th', ['14.01.2025', 'o', 'o', 'o', 'o', 'o']),
      couponRow({ text: 'Exterior', rowSpan: 4, className: 'group-label' }, '21'),
      couponRow(emptyCell(), '22'),
      couponRow(emptyCell(), '23'),
      couponRow(emptyCell(), '24'),
      couponRow({ text: 'Under hood', rowSpan: 2, className: 'group-label' }, '11'),
      couponRow(emptyCell(), '12')
    ]
  },
  scribe_line_measurement: {
    title: 'Scribe line measurement',
    phaseSheet: 'scribe'
  },
  crs_check_sheet: {
    title: 'CRS check sheet',
    phaseSheet: 'crs'
  },
  dismantling_inspection: {
    title: 'Dismantling inspection sheet filled',
    phaseSheet: 'dismantling'
  },
  photo_annexure: {
    title: 'Photo Annexure',
    phaseSheet: 'standard',
    columns: ['Applicable', 'Photo Set', 'Description', 'Upload status'],
    rows: [
      [{ type: 'radio' }, 'P-01', 'Front assembly', uploadCell('P-01 front assembly photo upload')],
      [{ type: 'radio' }, 'P-02', 'Side profile', uploadCell('P-02 side profile photo upload')],
      [{ type: 'radio' }, 'P-03', 'Underbody', uploadCell('P-03 underbody photo upload')],
      [{ type: 'radio' }, 'P-04', 'Close-up rust area', uploadCell('P-04 close-up rust area photo upload')]
    ]
  },
  [commonDetailsSectionId]: {
    title: 'Common Form',
    formOnly: true
  }
};

const phaseLinkedSectionIds = Object.keys(sections).filter((sectionId) => sectionId !== commonDetailsSectionId);
const approvalFlowSectionIds = [...phaseLinkedSectionIds];
const workflowDefaults = {
  selectedChecksheets: [],
  commonSaved: false,
  status: 'draft'
};
let workflowState = {
  ...workflowDefaults,
  ...(persistedState.workflow || {})
};

const sharedPhase = activePhaseBySection[commonDetailsSectionId] || phaseOptions[0];
activePhaseBySection[commonDetailsSectionId] = sharedPhase;
phaseLinkedSectionIds.forEach((sectionId) => {
  activePhaseBySection[sectionId] = sharedPhase;
});

if (persistedState.activeSectionId && persistedState.activeSectionId in sections) {
  activeSectionId = persistedState.activeSectionId;
}

function closeProfileMenu() {
  profileMenu.hidden = true;
  profileButton.setAttribute('aria-expanded', 'false');
}

function showToast(message) {
  clearTimeout(toastTimer);
  let toast = document.querySelector('#toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2000);
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    activeSectionId,
    activePhaseBySection,
    values: persistedState.values || {},
    workflow: workflowState
  }));
}

function stateKey(sectionId = activeSectionId) {
  return `${sectionId}::${activePhaseBySection[sectionId] || phaseOptions[0]}`;
}

function detailsKey(sectionId = activeSectionId) {
  return `${sectionId}::details`;
}

function controlStoreKey(control) {
  return control.closest('.addition-form') ? detailsKey() : stateKey();
}

function getValueStore(key = stateKey()) {
  persistedState.values ||= {};
  persistedState.values[key] ||= {};
  return persistedState.values[key];
}

function escapeSelector(value) {
  if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(value);
  return String(value).replace(/["\\]/g, '\\$&');
}

function controlValueByNameOrLabel(nameOrLabel) {
  const selectorValue = escapeSelector(nameOrLabel);
  const control = sectionBody.querySelector(`[name="${selectorValue}"], [aria-label="${selectorValue}"]`);
  if (!control) return '';
  if (control.type === 'checkbox') return control.checked;
  return control.value || '';
}

function buildCrsPayload() {
  const earthResistanceRanges = crsEarthResistanceDefaults.earthResistanceRanges.map((_, index) => ({
    from: controlValueByNameOrLabel(`earthResistanceBetween${index + 1}From`),
    to: controlValueByNameOrLabel(`earthResistanceBetween${index + 1}To`),
    value: controlValueByNameOrLabel(`earthResistanceBetween${index + 1}Value`)
  }));

  return {
    printDate: controlValueByNameOrLabel('crs-printDate'),
    userId: controlValueByNameOrLabel('crs-userId'),
    sheetTitle: controlValueByNameOrLabel('crs-sheetTitle') || crsDocumentTitle,
    pageNumber: controlValueByNameOrLabel('crs-pageNumber'),
    dateOfImplementation: controlValueByNameOrLabel('crs-dateOfImplementation'),
    model: controlValueByNameOrLabel('crs-model'),
    prototypeStage: controlValueByNameOrLabel('crs-prototypeStage'),
    temporarySymbol: controlValueByNameOrLabel('crs-temporarySymbol'),
    inspectionDay: controlValueByNameOrLabel('crs-inspectionDay'),
    inspectedBy: controlValueByNameOrLabel('crs-inspectedBy'),
    filmThicknessBefore: controlValueByNameOrLabel('crs-filmThicknessBefore'),
    filmThicknessAfter: controlValueByNameOrLabel('crs-filmThicknessAfter'),
    remark: controlValueByNameOrLabel('crs-remark'),
    inspectionRows: crsRows.map((row) => normalizeInspectionRow({
      ...row,
      filmThicknessBefore: controlValueByNameOrLabel(`${row.id} film thickness before`),
      filmThicknessAfter: controlValueByNameOrLabel(`${row.id} film thickness after`),
      inspectionValues: Object.fromEntries(crsInspectionPhases.map((phase) => [
        phase,
        controlValueByNameOrLabel(`${row.id} phase ${phase}`)
      ])),
      remark: controlValueByNameOrLabel(`${row.id} remark`)
    })),
    earthResistanceMeasurement: controlValueByNameOrLabel('earthResistanceMeasurement'),
    earthResistanceUnit: controlValueByNameOrLabel('earthResistanceUnit') || crsEarthResistanceDefaults.earthResistanceUnit,
    earthResistanceStandardValue: controlValueByNameOrLabel('earthResistanceStandardValue'),
    earthResistanceRanges,
    systemInspection: {
      systemWarningLampOnInspection: controlValueByNameOrLabel('systemWarningLampOnInspection phase 0'),
      highVoltageSystemInsulationResistance: controlValueByNameOrLabel('highVoltageSystemInsulationResistance phase 0'),
      insulationResistanceUnit: 'MΩ'
    }
  };
}

function controlKey(control, index) {
  return control.name || control.getAttribute('aria-label') || `control-${index}`;
}

function restoreControls() {
  sectionBody.querySelectorAll('input, select, textarea').forEach((control, index) => {
    if (control.matches('[data-phase-select]')) return;
    if (control.matches('[data-checksheet-choice]')) return;
    if (control.type === 'file') return;
    const store = getValueStore(controlStoreKey(control));
    const key = controlKey(control, index);
    if (!(key in store)) return;

    if (control.type === 'checkbox') {
      control.checked = Boolean(store[key]);
      return;
    }

    control.value = store[key];
  });
}

function persistControls() {
  sectionBody.querySelectorAll('input, select, textarea').forEach((control, index) => {
    if (control.matches('[data-phase-select]')) return;
    if (control.matches('[data-checksheet-choice]')) return;
    if (control.type === 'file') return;
    const store = getValueStore(controlStoreKey(control));
    const key = controlKey(control, index);
    store[key] = control.type === 'checkbox' ? control.checked : control.value;
  });
  if (activeSectionId === 'crs_check_sheet') {
    getValueStore().crsPayload = buildCrsPayload();
  }
  saveState();
}

function renderField(field) {
  const spanClass = field.span ? ` ${field.span}` : '';
  const isWorkflowLocked = workflowState.status === 'pending' || workflowState.status === 'approved';
  const required = field.required ? 'required' : '';
  const disabled = isWorkflowLocked ? 'disabled' : '';
  const labelText = `${field.label}${field.required ? '<b class="required-mark" aria-hidden="true">*</b>' : ''}`;

  if (field.type === 'dual-select') {
    return `
      <label class="field trail-group${spanClass}">
        <span>${labelText}</span>
        <div class="dual-selects">
          <select aria-label="${field.label} first select" ${disabled}>
            <option value=""></option>
            ${field.optionsA.map((option) => `<option>${option}</option>`).join('')}
          </select>
          <select aria-label="${field.label} second select" ${disabled}>
            <option value=""></option>
            ${field.optionsB.map((option) => `<option>${option}</option>`).join('')}
          </select>
        </div>
      </label>
    `;
  }

  if (field.type === 'select') {
    const activePhase = activePhaseBySection[activeSectionId] || phaseOptions[0];
    const isPhaseControlled = Boolean(field.phaseControlled);
    return `
      <label class="field select-field${spanClass}">
        <span>${labelText}</span>
        <select name="${field.name}" ${isPhaseControlled ? 'data-phase-select' : ''} ${required} ${disabled}>
          <option value=""></option>
          ${field.options.map((option) => `<option ${isPhaseControlled && option === activePhase ? 'selected' : ''}>${option}</option>`).join('')}
        </select>
      </label>
    `;
  }

  return `
    <label class="field${spanClass}">
      <span>${labelText}</span>
      <input type="text" name="${field.name}" placeholder="" ${required} ${disabled} />
    </label>
  `;
}

function getCommonFields() {
  return sharedDetailFields;
}

function workflowStatusCopy() {
  if (workflowState.status === 'approved') {
    return {
      label: 'Approved',
      detail: 'Approved checksheets are available to the PIC for vehicle inspection.'
    };
  }
  if (workflowState.status === 'changes_requested') {
    return {
      label: 'Changes requested',
      detail: 'MIC needs to update the package and submit it again.'
    };
  }
  if (workflowState.status === 'pending') {
    return {
      label: 'Pending admin approval',
      detail: 'The admin can review the common details and selected checksheets.'
    };
  }
  if (workflowState.commonSaved) {
    return {
      label: 'Checksheets in progress',
      detail: 'Fill the selected checksheets, then submit the complete package.'
    };
  }
  return {
    label: 'MIC draft',
    detail: 'Complete the vehicle and phase details, then select the applicable checksheets.'
  };
}

function selectedFlowSheets() {
  return approvalFlowSectionIds.filter((sectionId) => workflowState.selectedChecksheets.includes(sectionId));
}

function renderWorkflowTracker() {
  const status = workflowStatusCopy();
  const activeStep = workflowState.status === 'approved' ? 3 : workflowState.status === 'pending' ? 2 : 1;

  return `
    <section class="workflow-card" aria-label="Checksheet approval workflow">
      <div class="workflow-card__copy">
        <span class="eyebrow">Current status</span>
        <strong>${status.label}</strong>
        <p>${status.detail}</p>
      </div>
      <ol class="workflow-track">
        ${[
          ['MIC', 'Create'],
          ['Admin', 'Approve'],
          ['PIC', 'Check vehicle']
        ].map(([role, action], index) => `
          <li class="${index + 1 <= activeStep ? 'is-active' : ''}">
            <span>${index + 1}</span>
            <div><strong>${role}</strong><small>${action}</small></div>
          </li>
        `).join('')}
      </ol>
    </section>
  `;
}

function renderChecksheetSelector() {
  const isWorkflowLocked = workflowState.status === 'pending' || workflowState.status === 'approved';
  return `
    <fieldset class="checksheet-selector">
      <legend>
        <span class="eyebrow">Step 2</span>
        Select applicable checksheets
      </legend>
      <p>Choose one or more sheets for this vehicle and phase. Only selected sheets will be sent to Admin.</p>
      <div class="checksheet-options">
        ${approvalFlowSectionIds.map((sectionId, index) => {
          const checked = workflowState.selectedChecksheets.includes(sectionId);
          return `
            <label class="checksheet-option ${checked ? 'is-selected' : ''}">
              <input type="checkbox" value="${sectionId}" data-checksheet-choice ${checked ? 'checked' : ''} ${isWorkflowLocked ? 'disabled' : ''} />
              <span class="checksheet-option__mark" aria-hidden="true"></span>
              <span class="checksheet-option__number">0${index + 1}</span>
              <span class="checksheet-option__copy">
                <strong>${sections[sectionId].title}</strong>
                <small>${checked ? 'Included in approval package' : 'Select to include'}</small>
              </span>
            </label>
          `;
        }).join('')}
      </div>
    </fieldset>
  `;
}

function renderApprovalReview() {
  const selected = selectedFlowSheets();
  const canSubmit = workflowState.commonSaved && selected.length > 0;
  const isPending = workflowState.status === 'pending';
  const isApproved = workflowState.status === 'approved';
  const changesRequested = workflowState.status === 'changes_requested';

  return `
    <section class="approval-review ${!canSubmit ? 'is-muted' : ''}">
      <div class="approval-review__heading">
        <div>
          <span class="eyebrow">Approval package</span>
          <h3>${selected.length} checksheet${selected.length === 1 ? '' : 's'} selected</h3>
        </div>
        <span class="status-pill status-pill--${workflowState.status}">${workflowStatusCopy().label}</span>
      </div>
      <div class="approval-review__list">
        ${selected.length
          ? selected.map((sectionId) => `
              <div>
                <span class="review-check">✓</span>
                <strong>${sections[sectionId].title}</strong>
                <small>${activePhaseBySection[sectionId]}</small>
              </div>
            `).join('')
          : '<p>Select checksheets above to build the approval package.</p>'}
      </div>
      ${isPending ? `
        <div class="admin-decision">
          <div>
            <span class="eyebrow">Admin review preview</span>
            <strong>Common details and selected sheets are ready for review</strong>
          </div>
          <button class="secondary-action" type="button" data-request-changes>Request changes</button>
          <button class="primary-button" type="button" data-approve-package>Approve for PIC</button>
        </div>
      ` : ''}
      ${isApproved ? `
        <div class="pic-handoff">
          <span class="pic-handoff__icon">PIC</span>
          <div>
            <span class="eyebrow">PIC handoff</span>
            <strong>Vehicle checks are now available</strong>
            <p>The PIC will see the same ${selected.length} approved checksheet${selected.length === 1 ? '' : 's'} for this vehicle and phase.</p>
          </div>
        </div>
      ` : ''}
      ${!isPending && !isApproved ? `
        <div class="sheet-actions common-actions">
          <button class="primary-button save-sheet" type="button" data-save-common>
            ${workflowState.commonSaved ? 'Update common details' : 'Save & open selected sheets'}
          </button>
          <button class="primary-button submit-sheet" type="button" data-submit-approval ${canSubmit ? '' : 'disabled'}>
            ${changesRequested ? 'Resubmit to Admin' : 'Submit to Admin'}
          </button>
        </div>
      ` : ''}
    </section>
  `;
}

function renderCommonDetailsForm() {
  return `
    <section class="sheet-detail common-form-sheet" aria-label="MIC checksheet creation">
      ${renderWorkflowTracker()}
      <section class="common-details-card">
        <div class="form-section-heading">
          <span class="eyebrow">Step 1</span>
          <h3>Vehicle & phase details</h3>
          <p>These details will be shared across every selected checksheet.</p>
        </div>
        <form class="addition-form layout-standard">
          ${getCommonFields().map(renderField).join('')}
        </form>
      </section>
      ${renderChecksheetSelector()}
      ${renderApprovalReview()}
    </section>
  `;
}

function renderTableCell(cell) {
  if (cell && cell.type === 'radio') {
    return '<td><label class="applicable-cell"><input type="checkbox" data-applicable-toggle /><span></span></label></td>';
  }

  if (cell && cell.type === 'legacy-radio') {
    return '<td><label class="radio-cell"><input type="radio" name="applicable" /><span></span></label></td>';
  }

  if (cell && cell.type === 'empty') {
    return '';
  }

  if (cell && cell.type === 'input') {
    const value = String(cell.value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
    const label = String(cell.label ?? 'Editable table cell')
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
    return `<td class="editable-table-cell"><input class="table-input" type="text" value="${value}" aria-label="${label}" /></td>`;
  }

  if (cell && cell.type === 'upload') {
    const label = String(cell.label ?? 'Photo upload')
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
    return `
      <td>
        <label class="attachment-upload" aria-label="${label}">
          <input type="file" accept="image/*" data-attachment-input />
          <span>Upload</span>
        </label>
      </td>
    `;
  }

  if (cell && typeof cell === 'object') {
    const rowSpan = cell.rowSpan ? ` rowspan="${cell.rowSpan}"` : '';
    const colSpan = cell.colSpan ? ` colspan="${cell.colSpan}"` : '';
    const className = cell.className ? ` class="${cell.className}"` : '';
    return `<td${rowSpan}${colSpan}${className}>${cell.text ?? ''}</td>`;
  }

  return `<td>${cell ?? ''}</td>`;
}

function renderFlowSheetHeader(sectionId) {
  if (!approvalFlowSectionIds.includes(sectionId)) return '';

  const status = workflowState.status === 'approved'
    ? 'Approved for PIC'
    : workflowState.status === 'pending'
      ? 'Awaiting Admin'
      : 'MIC draft';

  return `
    <div class="flow-sheet-header">
      <div>
        <span class="eyebrow">Selected checksheet</span>
        <strong>${sections[sectionId].title}</strong>
      </div>
      <div class="flow-sheet-header__meta">
        <span>${activePhaseBySection[sectionId]}</span>
        <span class="status-pill status-pill--${workflowState.status}">${status}</span>
      </div>
    </div>
  `;
}

function renderSheetActions(sectionId, allowIndividualSubmit = true) {
  if (approvalFlowSectionIds.includes(sectionId)) {
    return `
      <div class="sheet-actions">
        <button class="primary-button save-sheet" type="button" data-save-sheet>Save checksheet</button>
        <button class="secondary-action" type="button" data-review-package>Review approval package</button>
      </div>
    `;
  }

  return `
    <div class="sheet-actions">
      <button class="primary-button save-sheet" type="button" data-save-sheet>Save</button>
      ${allowIndividualSubmit ? '<button class="primary-button submit-sheet" type="button" data-submit-sheet>Submit</button>' : ''}
    </div>
  `;
}

function renderPhaseObservationSheet(sectionId, config) {
  const activePhase = activePhaseBySection[sectionId] || phaseOptions[0];

  return `
    <section class="sheet-detail phase-observation-sheet" aria-label="${config.title} ${activePhase}">
      ${renderFlowSheetHeader(sectionId)}
      <div class="table-frame phase-observation-frame">
        <table class="phase-observation-table">
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Observation</th>
              <th>Criteria</th>
              <th>Actual</th>
              <th>Attachment</th>
            </tr>
          </thead>
          <tbody>
            ${phaseObservationRows.map((phaseLabel, index) => `
              <tr>
                <td class="phase-observation-index">${phaseLabel}</td>
                <td><input type="text" aria-label="${phaseLabel} observation" /></td>
                <td>
                  <select aria-label="${phaseLabel} criteria">
                    <option value=""></option>
                    ${phaseObservationCriteriaOptions.map((option) => `<option>${option}</option>`).join('')}
                  </select>
                </td>
                <td>
                  <select aria-label="${phaseLabel} actual">
                    <option value=""></option>
                    ${phaseObservationCriteriaOptions.map((option) => `<option>${option}</option>`).join('')}
                  </select>
                </td>
                <td>
                  <label class="attachment-upload" aria-label="${phaseLabel} attachment upload">
                    <input type="file" data-attachment-input />
                    <span>Upload</span>
                  </label>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ${renderSheetActions(sectionId)}
    </section>
  `;
}

function renderTable(columns, rows, legacyTable = false) {
  const frameClass = legacyTable ? 'table-frame' : 'table-frame applicable-table';
  return `
    <div class="${frameClass}">
      <table>
        <thead>
          <tr>${columns.map((column) => `<th>${column}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              ${row.map(renderTableCell).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderScribeMatrix(sectionId) {
  const activePhase = activePhaseBySection[sectionId] || phaseOptions[0];

  return `
    <section class="sheet-detail scribe-sheet" aria-label="Scribe line measurement ${activePhase}">
      <div class="table-frame scribe-frame applicable-table">
        <table class="scribe-table">
          <thead>
            <tr>
              <th>Applicable</th>
              <th>Category</th>
              ${bodyPanels.map((panel) => `<th>${panel}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${scribeDirections.map((direction, index) => `
              <tr>
                <td><label class="applicable-cell"><input type="checkbox" data-applicable-toggle /><span></span></label></td>
                <td>${direction}</td>
                ${bodyPanels.map((panel) => `
                  <td>
                    <input type="text" aria-label="${activePhase} ${direction} ${panel}" disabled />
                  </td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="sheet-actions">
        <button class="primary-button save-sheet" type="button" data-save-sheet>Save</button>
        <button class="primary-button submit-sheet" type="button" data-submit-sheet>Submit</button>
        <a class="secondary-button" href="../">Go Back</a>
      </div>
    </section>
  `;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function renderCrsMetaFields(fields, isReadOnly = false) {
  return fields.map(([name, label]) => `
    <label class="field">
      <span>${label}</span>
      <input type="text" name="crs-${name}" value="${name === 'sheetTitle' ? escapeHtml(crsDocumentTitle) : ''}" aria-label="CRS ${label}" ${isReadOnly ? 'disabled' : ''} />
    </label>
  `).join('');
}

function renderCrsEarthResistanceFields(isReadOnly = false) {
  return `
    <section class="crs-earth-panel" aria-label="Earth resistance measurement">
      <div>
        <span class="eyebrow">Earth resistance measurement</span>
        <strong>Between measurement ranges</strong>
      </div>
      <div class="crs-earth-grid">
        <label class="field">
          <span>Measurement</span>
          <input type="text" name="earthResistanceMeasurement" aria-label="Earth resistance measurement" ${isReadOnly ? 'disabled' : ''} />
        </label>
        <label class="field">
          <span>Unit</span>
          <input type="text" name="earthResistanceUnit" value="${escapeHtml(crsEarthResistanceDefaults.earthResistanceUnit)}" aria-label="Earth resistance unit" ${isReadOnly ? 'disabled' : ''} />
        </label>
        <label class="field">
          <span>Standard value</span>
          <input type="text" name="earthResistanceStandardValue" aria-label="Earth resistance standard value" ${isReadOnly ? 'disabled' : ''} />
        </label>
      </div>
      <div class="crs-earth-ranges">
        ${crsEarthResistanceDefaults.earthResistanceRanges.map((range, index) => `
          <div class="crs-earth-range">
            <span>Between</span>
            <input type="text" name="earthResistanceBetween${index + 1}From" aria-label="Earth resistance between ${index + 1} from" ${isReadOnly ? 'disabled' : ''} />
            <span>and</span>
            <input type="text" name="earthResistanceBetween${index + 1}To" aria-label="Earth resistance between ${index + 1} to" ${isReadOnly ? 'disabled' : ''} />
            <span>=</span>
            <input type="text" name="earthResistanceBetween${index + 1}Value" aria-label="Earth resistance between ${index + 1} value" ${isReadOnly ? 'disabled' : ''} />
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderCrsSheet(sectionId) {
  const activePhase = activePhaseBySection[sectionId] || phaseOptions[0];
  const isReadOnly = workflowState.status === 'pending' || workflowState.status === 'approved';
  const renderedSections = new Set();

  return `
    <section class="sheet-detail crs-sheet" aria-label="CRS check sheet ${activePhase}" data-sheet-readonly="${isReadOnly}">
      <input type="hidden" name="crs-title" value="${escapeHtml(crsDocumentTitle)}" />
      <div class="crs-document-header">
        <div>
          <span class="eyebrow">CRS inspection</span>
          <h3>${crsDocumentTitle}</h3>
        </div>
      </div>
      <div class="crs-meta-grid">
        ${renderCrsMetaFields(crsDocumentFields, isReadOnly)}
      </div>
      <div class="crs-meta-grid crs-meta-grid--shared">
        ${renderCrsMetaFields(crsSharedInspectionFields, isReadOnly)}
      </div>
      <div class="table-frame applicable-table crs-frame">
        <table class="crs-table">
          <thead>
            <tr>
              <th>Applicable</th>
              <th>Section</th>
              <th>Item</th>
              <th>Sub item</th>
              <th>Position</th>
              <th>Side</th>
              <th>Film Thickness Before</th>
              <th>Film Thickness After</th>
              ${crsInspectionPhases.map((phase) => `<th>${phase}</th>`).join('')}
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            ${crsRows.map((row) => {
              const sectionLabel = [row.sectionNumber, row.sectionName].filter(Boolean).join('. ');
              const shouldRenderSection = !renderedSections.has(sectionLabel);
              renderedSections.add(sectionLabel);
              const rowLabel = [row.sectionName, row.itemName, row.subItemName, row.position, row.side].filter(Boolean).join(' ');
              return `
                ${shouldRenderSection ? `
                  <tr class="crs-section-row">
                    <td colspan="${crsInspectionPhases.length + 9}">${escapeHtml(sectionLabel)}</td>
                  </tr>
                ` : ''}
                <tr>
                  <td class="crs-sticky crs-sticky--applicable"><label class="applicable-cell"><input type="checkbox" aria-label="Apply ${escapeHtml(rowLabel)}" data-applicable-toggle ${isReadOnly ? 'disabled' : ''} /><span></span></label></td>
                  <td class="crs-section-cell crs-sticky crs-sticky--section">${escapeHtml(sectionLabel)}</td>
                  <td class="crs-sticky crs-sticky--item">${escapeHtml(row.itemName)}</td>
                  <td class="crs-sticky crs-sticky--sub-item crs-sub-item-cell">${escapeHtml(row.subItemName)}</td>
                  <td class="crs-sticky crs-sticky--position crs-position-cell">${escapeHtml(row.position)}</td>
                  <td class="crs-sticky crs-sticky--side crs-side-cell">${escapeHtml(row.side || '')}</td>
                  <td class="crs-sticky crs-sticky--film-before crs-film-cell"><input class="crs-film-input" type="text" value="${escapeHtml(row.filmThicknessBefore)}" aria-label="${escapeHtml(`${row.id} film thickness before`)}" disabled /></td>
                  <td class="crs-sticky crs-sticky--film-after crs-film-cell"><input class="crs-film-input" type="text" value="${escapeHtml(row.filmThicknessAfter)}" aria-label="${escapeHtml(`${row.id} film thickness after`)}" disabled /></td>
                  ${crsInspectionPhases.map((phase) => `
                    <td>
                      <input class="crs-phase-input" type="text" value="${escapeHtml(row.inspectionValues[phase])}" aria-label="${escapeHtml(`${row.id} phase ${phase}`)}" disabled />
                    </td>
                  `).join('')}
                  <td><input class="crs-remark-input" type="text" value="${escapeHtml(row.remark)}" aria-label="${escapeHtml(`${row.id} remark`)}" disabled /></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
      ${renderCrsEarthResistanceFields(isReadOnly)}
      <p class="sheet-note">Inspection of rust and water with rust must include each hole edge and panel matching portion.</p>
      <div class="sheet-actions">
        <button class="primary-button save-sheet" type="button" data-save-sheet>Save</button>
        <button class="primary-button submit-sheet" type="button" data-submit-sheet>Submit</button>
        <a class="secondary-button" href="../">Go Back</a>
      </div>
    </section>
  `;
}

function renderDismantlingSheet(sectionId) {
  const activePhase = activePhaseBySection[sectionId] || phaseOptions[0];

  return `
    <section class="sheet-detail dismantling-sheet" aria-label="Dismantling inspection sheet ${activePhase}">
      <div class="table-frame applicable-table dismantling-frame">
        <table class="dismantling-table">
          <thead>
            <tr>
              <th>Applicable</th>
              <th>Removal / Fuse cut parts</th>
              <th>Position</th>
              <th>Side</th>
              <th>Corrosion rating scale of parts inside</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            ${dismantlingRows.map(([part, position, side]) => `
              <tr>
                <td><label class="applicable-cell"><input type="checkbox" data-applicable-toggle /><span></span></label></td>
                <td>${part}</td>
                <td>${position}</td>
                <td>${side}</td>
                <td>
                  <select aria-label="${activePhase} ${part} ${position} corrosion rating" disabled>
                    <option value=""></option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                  </select>
                </td>
                <td><input type="text" aria-label="${activePhase} ${part} ${position} comment" disabled /></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="sheet-actions">
        <button class="primary-button save-sheet" type="button" data-save-sheet>Save</button>
        <button class="primary-button submit-sheet" type="button" data-submit-sheet>Submit</button>
        <a class="secondary-button" href="../">Go Back</a>
      </div>
    </section>
  `;
}

function renderStandardPhaseSheet(sectionId, config) {
  const activePhase = activePhaseBySection[sectionId] || phaseOptions[0];

  return `
      <section class="sheet-detail" aria-label="${config.title} ${activePhase}">
      ${renderFlowSheetHeader(sectionId)}
        ${renderTable(config.columns, config.rows)}
      ${renderSheetActions(sectionId)}
    </section>
  `;
}

function renderPhaseSheet(sectionId, config) {
  if (config.phaseSheet === 'phase-observation') return renderPhaseObservationSheet(sectionId, config);
  if (config.phaseSheet === 'scribe') return renderScribeMatrix(sectionId);
  if (config.phaseSheet === 'crs') return renderCrsSheet(sectionId);
  if (config.phaseSheet === 'dismantling') return renderDismantlingSheet(sectionId);
  return renderStandardPhaseSheet(sectionId, config);
}

function renderSection(sectionId) {
  const config = sections[sectionId];
  if (!config) return;

  activeSectionId = sectionId;
  persistedState.activeSectionId = sectionId;
  sectionTitle.textContent = config.title;
  sectionBody.innerHTML = `
    ${sectionId === commonDetailsSectionId ? renderCommonDetailsForm() : renderPhaseSheet(sectionId, config)}
  `;

  sectionTabs.querySelectorAll('[data-section]').forEach((button) => {
    button.classList.toggle('active', button.dataset.section === sectionId);
    button.setAttribute('aria-pressed', String(button.dataset.section === sectionId));
  });
  updateSidebarState();

  const phaseSelect = sectionBody.querySelector('[data-phase-select]');
  if (phaseSelect) {
    phaseSelect.addEventListener('change', () => {
      persistControls();
      const nextPhase = phaseSelect.value || phaseOptions[0];
      activePhaseBySection[commonDetailsSectionId] = nextPhase;
      phaseLinkedSectionIds.forEach((linkedSectionId) => {
        activePhaseBySection[linkedSectionId] = nextPhase;
      });
      persistedState.activePhaseBySection = { ...activePhaseBySection };
      saveState();
      renderSection(sectionId);
    });
  }

  const saveCommonButton = sectionBody.querySelector('[data-save-common]');
  if (saveCommonButton) {
    saveCommonButton.addEventListener('click', () => {
      persistControls();
      const missingField = [...sectionBody.querySelectorAll('.addition-form [required]')]
        .find((field) => !String(field.value).trim());
      if (missingField) {
        missingField.classList.add('is-invalid');
        missingField.focus();
        showToast('Complete the required vehicle and phase details');
        return;
      }
      const selected = selectedFlowSheets();
      if (!selected.length) {
        showToast('Select at least one checksheet');
        return;
      }
      workflowState.commonSaved = true;
      workflowState.status = 'draft';
      saveState();
      showToast('Common details saved. Selected checksheets are ready.');
      renderSection(selected[0]);
    });
  }

  sectionBody.querySelectorAll('[data-checksheet-choice]').forEach((choice) => {
    choice.addEventListener('change', () => {
      persistControls();
      workflowState.selectedChecksheets = [...sectionBody.querySelectorAll('[data-checksheet-choice]:checked')]
        .map((input) => input.value);
      workflowState.commonSaved = false;
      workflowState.status = 'draft';
      saveState();
      renderSection(commonDetailsSectionId);
    });
  });

  const submitApprovalButton = sectionBody.querySelector('[data-submit-approval]');
  if (submitApprovalButton) {
    submitApprovalButton.addEventListener('click', () => {
      persistControls();
      workflowState.status = 'pending';
      saveState();
      showToast('Package sent to Admin for approval');
      renderSection(commonDetailsSectionId);
    });
  }

  const approvePackageButton = sectionBody.querySelector('[data-approve-package]');
  if (approvePackageButton) {
    approvePackageButton.addEventListener('click', () => {
      workflowState.status = 'approved';
      saveState();
      showToast('Approved. Checksheets are now available to PIC.');
      renderSection(commonDetailsSectionId);
    });
  }

  const requestChangesButton = sectionBody.querySelector('[data-request-changes]');
  if (requestChangesButton) {
    requestChangesButton.addEventListener('click', () => {
      workflowState.status = 'changes_requested';
      saveState();
      showToast('Admin requested changes from MIC');
      renderSection(commonDetailsSectionId);
    });
  }

  const reviewPackageButton = sectionBody.querySelector('[data-review-package]');
  if (reviewPackageButton) {
    reviewPackageButton.addEventListener('click', () => {
      persistControls();
      renderSection(commonDetailsSectionId);
    });
  }

  sectionBody.querySelectorAll('[data-attachment-input]').forEach((input) => {
    input.addEventListener('change', () => {
      const label = input.closest('.attachment-upload');
      if (!label) return;
      const button = label.querySelector('span');
      if (!button) return;
      const fileName = input.files && input.files.length ? input.files[0].name : 'Upload';
      button.textContent = fileName;
    });
  });

  const saveSheetButton = sectionBody.querySelector('[data-save-sheet]');
  if (saveSheetButton) {
    saveSheetButton.addEventListener('click', () => {
      persistControls();
      showToast(`${config.title} ${activePhaseBySection[sectionId]} saved`);
    });
  }

  const submitSheetButton = sectionBody.querySelector('[data-submit-sheet]');
  if (submitSheetButton) {
    submitSheetButton.addEventListener('click', () => {
      persistControls();
      showToast(`${config.title} ${activePhaseBySection[sectionId]} submitted`);
    });
  }

  restoreControls();

  sectionBody.querySelectorAll('[data-applicable-toggle]').forEach((toggle) => {
    const row = toggle.closest('tr');
    const updateRow = () => {
      const isReadOnlySheet = Boolean(row.closest('[data-sheet-readonly="true"]'));
      row.classList.toggle('is-applicable', toggle.checked);
      row.querySelectorAll('input[type="text"], textarea, select').forEach((field) => {
        field.disabled = isReadOnlySheet || !toggle.checked;
      });
    };
    toggle.addEventListener('change', updateRow);
    updateRow();
  });

  sectionBody.addEventListener('input', persistControls);
  sectionBody.addEventListener('change', persistControls);
  saveState();
}

function updateSidebarState() {
  sectionTabs.querySelectorAll('[data-flow-sheet]').forEach((button) => {
    const sectionId = button.dataset.section;
    const isSelected = workflowState.selectedChecksheets.includes(sectionId);
    const isAvailable = workflowState.commonSaved && isSelected;
    const status = button.querySelector('small');
    button.classList.toggle('is-selected', isSelected);
    button.classList.toggle('is-locked', !isAvailable);
    button.setAttribute('aria-disabled', String(!isAvailable));
    if (status) {
      status.textContent = isAvailable
        ? workflowState.status === 'approved'
          ? 'PIC ready'
          : workflowState.status === 'pending'
            ? 'Pending approval'
            : 'MIC editing'
        : isSelected
          ? 'Save common form first'
          : 'Not selected';
    }
  });
}

profileButton.addEventListener('click', (event) => {
  event.stopPropagation();
  const shouldOpen = profileMenu.hidden;
  profileMenu.hidden = !shouldOpen;
  profileButton.setAttribute('aria-expanded', String(shouldOpen));
});

document.addEventListener('click', (event) => {
  if (!profileMenu.contains(event.target)) closeProfileMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeProfileMenu();
    profileButton.focus();
  }
});

document.querySelectorAll('[data-signout]').forEach((button) => {
  button.addEventListener('click', () => {
    window.location.href = homeHref;
  });
});

sectionTabs.addEventListener('click', (event) => {
  const button = event.target.closest('[data-section]');
  if (!button || button.dataset.section === activeSectionId) return;
  if (button.matches('[data-flow-sheet]')) {
    const isAvailable = workflowState.commonSaved
      && workflowState.selectedChecksheets.includes(button.dataset.section);
    if (!isAvailable) {
      showToast(workflowState.selectedChecksheets.includes(button.dataset.section)
        ? 'Save the common form to open this checksheet'
        : 'Select this checksheet in the Common Form first');
      return;
    }
  }
  persistControls();
  renderSection(button.dataset.section);
});

renderSection(activeSectionId);

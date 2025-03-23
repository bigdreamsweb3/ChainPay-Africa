// Define service types for bill payment options
export const serviceTypes = [
  {
    id: 'AIRTIME',
    label: 'Airtime',
    description: 'Purchase airtime for any mobile network',
    icon: '/icons/airtime.svg'
  },
  {
    id: 'DATA',
    label: 'Data',
    description: 'Buy data bundles for internet access',
    icon: '/icons/data.svg'
  },
  {
    id: 'ELECTRICITY',
    label: 'Electricity',
    description: 'Pay for electricity and utility bills',
    icon: '/icons/electricity.svg'
  }
];

export type ServiceType = {
  id: string;
  label: string;
  description: string;
  icon: string;
}; 
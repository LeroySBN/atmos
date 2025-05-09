import WeatherClient from '@/components/Weather/WeatherClient';

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <WeatherClient />
    </div>
  );
}

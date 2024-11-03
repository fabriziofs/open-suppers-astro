<script lang="ts" setup>

interface Period {
  open: string;
  close: string;
}

interface Schedule {
  periods: Period[];
  openNow: boolean;
}

interface Supermarket {
  id: string;
  title: string;
  imageUrl: string;
  schedule: Schedule;
}

const superMarket = defineProps<Supermarket>();
const today = new Date();

const getDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-ES', {weekday: 'long'}).format(date);
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-ES', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

const getTodaySchedule = () => {
  const todayDay = today.getDay();

  return superMarket.schedule.periods.find(period => {
    const periodDate = new Date(period.open);
    return periodDate.getDay() === todayDay;
  });
};

const todaySchedule = getTodaySchedule();
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden max-w-md">
    <img :alt="title" :src="imageUrl" class="w-full h-48 object-cover">

    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-800">{{ title }}</h2>
        <span
            :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                schedule.openNow ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            ]"
        >
          {{ schedule.openNow ? 'Open' : 'Closed' }}
        </span>
      </div>

      <div class="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 class="text-lg font-medium text-gray-700 mb-2">Today's Hours</h3>
        <div v-if="todaySchedule" class="text-lg text-blue-800 font-medium">
          {{ formatTime(todaySchedule.open) }} - {{ formatTime(todaySchedule.close) }}
        </div>
        <div v-else class="text-red-600">
          Closed today
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-medium text-gray-700">Weekly Schedule</h3>
          <button
              class="text-sm text-blue-600 hover:text-blue-800"
              @click="$refs.scheduleDetails.classList.toggle('hidden')"
          >
            Show/Hide
          </button>
        </div>
        <div ref="scheduleDetails" class="hidden space-y-1">
          <div
              v-for="period in schedule.periods"
              :key="period.open.toString()"
              :class="[
                  'flex justify-between items-center py-1 text-sm',
                  getDayName(period.open) === getDayName(today.toString()) ? 'bg-blue-50 p-2 rounded' : ''
              ]">
            <span class="text-gray-600 font-medium w-32">{{ getDayName(period.open) }}</span>
            <span class="text-gray-500">{{ formatTime(period.open) }} - {{ formatTime(period.close) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<template>
  <!-- HERO -->
  <section class="hero-section">
    <div class="hero-overlay" />
    <v-container class="hero-content">
      <v-row justify="center" align="center" style="min-height: 85vh">
        <v-col cols="12" md="8" class="text-center">

          <v-chip color="amber-darken-2" variant="tonal" size="small" class="mb-4 font-weight-bold">
            🏆 #1 Real Estate Platform
          </v-chip>

          <h1 class="hero-title mb-4">
            Find Your Dream<br/>
            <span class="text-amber-darken-2">Property Today</span>
          </h1>

          <p class="text-body-1 text-white opacity-80 mb-8">
            Discover thousands of premium properties across the country.<br class="d-none d-md-block"/>
            From cozy apartments to luxury estates — your perfect home awaits.
          </p>

          <!-- Search Bar -->
          <v-card rounded="xl" elevation="8" class="pa-2 mx-auto" max-width="780">
            <v-row no-gutters align="center" class="ga-2">
              <v-col cols="12" sm="4">
                <v-select
                  v-model="searchType"
                  :items="['Buy', 'Rent', 'Commercial']"
                  variant="solo"
                  flat
                  density="comfortable"
                  hide-details
                  prepend-inner-icon="mdi-home-outline"
                  label="Type"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <v-text-field
                  v-model="searchLocation"
                  variant="solo"
                  flat
                  density="comfortable"
                  hide-details
                  prepend-inner-icon="mdi-map-marker-outline"
                  placeholder="City, neighborhood, or address..."
                />
              </v-col>
              <v-col cols="12" sm="auto" class="flex-grow-1 flex-sm-grow-0">
                <v-btn color="primary" block size="large" rounded="lg" variant="flat">
                  <v-icon start>mdi-magnify</v-icon>
                  Search
                </v-btn>
              </v-col>
            </v-row>
          </v-card>

          <!-- Stats -->
          <v-row justify="center" class="mt-10 ga-4">
            <v-col v-for="stat in stats" :key="stat.label" cols="auto" class="text-white text-center">
              <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
              <div class="text-caption opacity-70">{{ stat.label }}</div>
            </v-col>
          </v-row>

        </v-col>
      </v-row>
    </v-container>
  </section>

  <!-- FEATURED LISTINGS -->
  <v-sheet class="py-16">
    <v-container>
      <div class="text-center mb-10">
        <h2 class="text-h4 font-weight-bold text-grey-darken-4">Featured Properties</h2>
        <p class="text-body-1 text-medium-emphasis mt-2">Hand-picked premium listings just for you</p>
      </div>

      <v-row>
        <v-col
          v-for="property in featuredProperties"
          :key="property.id"
          cols="12" sm="6" lg="4"
        >
          <v-card rounded="xl" elevation="0" border height="100%" class="property-card">
            <div style="position:relative; height:220px; overflow:hidden">
              <img
                :src="`https://picsum.photos/seed/${property.id}/600/400`"
                style="width:100%; height:100%; object-fit:cover; transition: transform 0.4s ease"
                class="property-img"
                :alt="property.title"
              />
              <v-chip
                :color="property.status === 'For Sale' ? 'success' : 'info'"
                size="small"
                variant="elevated"
                style="position:absolute; top:12px; left:12px"
              >
                {{ property.status }}
              </v-chip>
            </div>

            <v-card-text>
              <div class="text-h6 font-weight-bold mb-1">{{ property.price }}</div>
              <div class="text-body-2 text-medium-emphasis mb-2">
                <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>{{ property.location }}
              </div>
              <div class="text-subtitle-2 font-weight-medium mb-3">{{ property.title }}</div>
              <v-divider class="mb-3" />
              <div class="d-flex ga-4 text-caption text-medium-emphasis">
                <span><v-icon size="14">mdi-bed</v-icon> {{ property.beds }} Beds</span>
                <span><v-icon size="14">mdi-shower</v-icon> {{ property.baths }} Baths</span>
                <span><v-icon size="14">mdi-ruler-square</v-icon> {{ property.sqft }} sqft</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div class="text-center mt-10">
        <v-btn variant="outlined" color="primary" size="large" rounded="lg">
          View All Properties
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </v-container>
  </v-sheet>

  <!-- WHY US -->
  <v-sheet color="grey-lighten-5" class="py-16">
    <v-container>
      <div class="text-center mb-12">
        <h2 class="text-h4 font-weight-bold text-grey-darken-4">Why Choose EstateVue</h2>
      </div>
      <v-row>
        <v-col v-for="feature in features" :key="feature.title" cols="12" sm="6" md="3">
          <div class="text-center pa-4">
            <v-avatar size="64" color="primary" variant="tonal" class="mb-4">
              <v-icon size="30">{{ feature.icon }}</v-icon>
            </v-avatar>
            <div class="text-subtitle-1 font-weight-bold mb-2">{{ feature.title }}</div>
            <p class="text-body-2 text-medium-emphasis">{{ feature.desc }}</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue'

const searchType = ref('Buy')
const searchLocation = ref('')

const stats = [
  { value: '12,000+', label: 'Properties Listed' },
  { value: '8,500+',  label: 'Happy Clients' },
  { value: '350+',    label: 'Verified Agents' },
  { value: '98%',     label: 'Satisfaction Rate' },
]

const featuredProperties = [
  { id: 1, title: 'Modern Family Villa with Pool', price: '₱12,500,000', location: 'Alabang, Muntinlupa', status: 'For Sale', beds: 4, baths: 3, sqft: 320 },
  { id: 2, title: 'Executive Condo in BGC',        price: '₱8,200,000',  location: 'BGC, Taguig',        status: 'For Sale', beds: 2, baths: 2, sqft: 98  },
  { id: 3, title: 'Spacious Townhouse',            price: '₱45,000/mo',  location: 'Quezon City',        status: 'For Rent', beds: 3, baths: 2, sqft: 180 },
]

const features = [
  { icon: 'mdi-shield-check',    title: 'Verified Listings', desc: 'All properties are verified by our expert team.' },
  { icon: 'mdi-currency-php',    title: 'Best Prices',       desc: 'We negotiate the best deals for our clients.' },
  { icon: 'mdi-headset',         title: '24/7 Support',      desc: 'Our agents are always ready to assist you.' },
  { icon: 'mdi-map-search',      title: 'Smart Search',      desc: 'AI-powered search to find your perfect match.' },
]
</script>

<style scoped>
/* Hero needs custom CSS — background image + overlay positioning can't be done with Vuetify utilities */
.hero-section {
  min-height: 90vh;
  background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800') center/cover no-repeat;
  position: relative;
  display: flex;
  align-items: center;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(10,48,60,0.88) 0%, rgba(10,48,60,0.65) 100%);
}
.hero-content {
  position: relative;
  z-index: 2;
}
.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 800;
  color: white;
  line-height: 1.1;
}

/* Card hover — transform not available as Vuetify utility */
.property-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  overflow: hidden;
}
.property-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.12) !important;
}
.property-card:hover .property-img {
  transform: scale(1.05);
}
</style>
<script lang="ts" setup>
const { handleFileInput, files } = useFileStorage()

const uploadFile = async () => {
  const response = await $fetch('/api/upload', {
    method: 'POST',
    body: {
      files: files.value,
    },
  })
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-background"
  >
    <div class="max-w-md w-full px-4 md:px-0">
      <form
        class="bg-card rounded-lg shadow-lg p-6"
        @submit.prevent="uploadFile"
      >
        <div class="mb-4">
          <h1 class="text-3xl font-bold mb-4 text-black">Upload Your Video</h1>
          <p class="text-muted-foreground mb-8">
            Easily share your MP4 videos with our simple upload form.
          </p>
          <div class="flex flex-col gap-2">
            <Label for="fileInput"> Select MP4 File </Label>
            <Input
              id="fileInput"
              accept="video/mp4,.mp3"
              type="file"
              @input="handleFileInput"
            />
          </div>
        </div>
        <Button type="submit"> Upload Video </Button>
      </form>
    </div>
  </div>
</template>

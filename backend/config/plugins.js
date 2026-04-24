module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi/provider-upload-aws-s3',
      providerOptions: {
        s3Options: {
          accessKeyId: env('MINIO_ACCESS_KEY'),
          secretAccessKey: env('MINIO_SECRET_KEY'),
          endpoint: `http://${env('MINIO_ENDPOINT')}:${env('MINIO_PORT')}`,
          params: {
            Bucket: env('MINIO_BUCKET', 'gov-portal-media'),
          },
          forcePathStyle: true,
        },
      },
    },
  },
});
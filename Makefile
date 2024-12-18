generate-schema:
	get-graphql-schema --header="Authorization=${token}" http://localhost:5000/graphql > ./src/generated/schema.graphql 

deploy-sandbox:
	aws s3 sync ./dist s3://gokudos-web-sandbox/

deploy-staging:
	aws s3 sync ./dist s3://gokudos-web-staging/

deploy-prod:
	@echo "You are deploying to PRODUCTION. Are you sure? [y/N] " && read ans && [ $${ans:-N} == y ]
	@echo "Did you build with 'yarn build:production'? Are you really sure? [y/N] " && read ans && [ $${ans:-N} == y ]
	@echo "Deploying to PRODUCTION..."
	aws s3 sync ./dist s3://gokudos-web-production/

invalidate-sandbox:
	aws cloudfront create-invalidation --distribution-id ERT3K11S6TCV0 --paths "/*"

invalidate-production:
	aws cloudfront create-invalidation --distribution-id E210OXBIUS24OC --paths "/*"
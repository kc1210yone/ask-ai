FROM public.ecr.aws/lambda/nodejs:24

COPY package.json ${LAMBDA_TASK_ROOT}
COPY dist ${LAMBDA_TASK_ROOT}/dist

CMD [ "./dist/src/index.handler" ]

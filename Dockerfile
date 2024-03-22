FROM cockroachdb/cockroach:latest

ENV COCKROACH_USER coffee_admin

EXPOSE 8080 26257

CMD ["start-single-node", "--insecure"]

FROM nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
VOLUME [ "/var/log/nginx/log" ]
EXPOSE 80
EXPOSE 443
CMD [ "nginx", "-g", "daemon off;" ]
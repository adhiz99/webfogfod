FROM ubuntu:latest

#ENV http_proxy http://10.88.49.94:3128
#ENV https_proxy http://10.88.49.94:3128

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install wget -y
RUN apt-get install nano -y
RUN apt-get install inetutils-ping -y
RUN apt-get install telnet -y
RUN apt-get install nodejs -y
RUN apt-get install npm -y
RUN apt-get install git -y
RUN apt-get install krb5-user -y
RUN apt-get install unixodbc -y
RUN apt-get install unixodbc-dev -y
RUN apt-get install alien dpkg-dev debhelper build-essential -y
ADD ClouderaImpalaODBC-2.7.2.1011-1.x86_64.rpm ./ 
RUN alien ./ClouderaImpalaODBC-2.7.2.1011-1.x86_64.rpm
RUN dpkg -i ./clouderaimpalaodbc_2.7.2.1011-2_amd64.deb

ADD impala_env.sh /etc/profile.d/

RUN . /etc/profile.d/impala_env.sh

ADD odbc.ini /etc/

ADD odbcinst.ini /etc/

ADD pelindo_dlake.pem /etc/

WORKDIR /home/ubuntu/

RUN git clone  https://adhiz99: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@github.com/bimosptr1/webfogfod.git

WORKDIR /home/ubuntu/webfogfod/

COPY .env.local /home/ubuntu/webfogfod/

RUN npm i

RUN npm i pm2 -g

RUN git pull https://adhiz99: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@github.com/bimosptr1/webfogfod.git

CMD ["pm2-runtime", "ecosystem.config.js", "--only webfogfod-dev"]

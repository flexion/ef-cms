FROM cypress/base:8

WORKDIR /home/app

RUN echo "deb [check-valid-until=no] http://archive.debian.org/debian jessie-backports main" > /etc/apt/sources.list.d/jessie-backports.list
RUN sed -i '/deb http:\/\/deb.debian.org\/debian jessie-updates main/d' /etc/apt/sources.list
RUN apt-get -o Acquire::Check-Valid-Until=false update

RUN apt-get install -y -t jessie-backports openjdk-8-jdk

RUN apt-get install -yq git bash

RUN apt-get -o Acquire::Check-Valid-Until=false update && \
    apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
    libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

ENV AWS_CLI_VERSION 1.16.31

RUN apt-get -o Acquire::Check-Valid-Until=false update
RUN apt-get install -yq openssh-client python python-dev python-pip python-setuptools ca-certificates groff less
RUN apt-get install -yq unzip wget

RUN pip install --upgrade pip
RUN pip --version
RUN apt-get install -y awscli
RUN pip install --upgrade awscli==${AWS_CLI_VERSION}

#RUN pip install setuptools
#RUN pip install pylint

RUN apt-get install -y jq

RUN wget -q -O terraform_0.11.11_linux_amd64.zip https://releases.hashicorp.com/terraform/0.11.11/terraform_0.11.11_linux_amd64.zip && \
    unzip -o terraform_0.11.11_linux_amd64.zip terraform

RUN cp terraform /usr/local/bin/

RUN curl -OL 'https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-3.2.0.1227-linux.zip'
RUN mkdir sonar_scanner
RUN unzip -d sonar_scanner sonar-scanner-cli-3.2.0.1227-linux.zip
RUN mv sonar_scanner/* sonar_home
RUN rm -rf sonar_scanner sonar-scanner-cli-3.2.0.1227-linux.zip

ENV SONAR_RUNNER_HOME=/home/app/sonar_home
ENV PATH ${SONAR_RUNNER_HOME}/bin:$PATH

RUN sed -i 's/use_embedded_jre=true/use_embedded_jre=false/g' sonar_home/bin/sonar-scanner

RUN java -version

RUN CI=true npm install cypress

RUN apt-get install -y shellcheck

COPY shared/package.json /home/app/shared/package.json
COPY shared/package-lock.json /home/app/shared/package-lock.json
RUN cd /home/app/shared && npm i

COPY efcms-service/package.json /home/app/efcms-service/package.json
COPY efcms-service/package-lock.json /home/app/efcms-service/package-lock.json
RUN cd /home/app/efcms-service && npm i

COPY web-client/package.json /home/app/web-client/package.json
COPY web-client/package-lock.json /home/app/web-client/package-lock.json
RUN cd /home/app/web-client && npm i

COPY . /home/app

RUN mkdir -p /home/app/web-client/cypress/screenshots
RUN mkdir -p /home/app/web-client/cypress/videos

CMD echo "please overwrite this command"
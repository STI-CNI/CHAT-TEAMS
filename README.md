# Integrando ChatGPT com Microsoft Teams
Não seria ótimo se você e seus colegas de equipe pudessem facilmente enviar perguntas ao ChatGPT em chats ou reuniões em grupo do Microsoft Teams? Este guia mostrará como integrar o Microsoft Teams à plataforma Azure OpenAI em apenas algumas etapas. Ao aproveitar a associação à plataforma de desenvolvedor do Microsoft 365 e uma assinatura gratuita do Azure, você pode criar um ambiente sandbox especificamente para esta prova de conceito.

![introdução](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/teamsgpt-overview-small.png)

## O que é TeamsGPT?
- Teamsgpt é um aplicativo personalizado do Teams integrado ao modelo ChatGPT do Azure e OpenAI. Ele pode ser adicionado a um chat/grupo/canal como um assistente de IA para ajudar a responder perguntas e fornecer assistência. Ele aproveita o Azure Bot Service, o App Service e o Cognitive Service OpenAI para fornecer sua funcionalidade.
- Este diagrama mostra o menor número de recursos de nuvem necessários para criar um ambiente de desenvolvimento POC/POV. Uma arquitetura diferente será discutida posteriormente para cargas de trabalho de produção.

![devarch](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/devarch.png)
## Pré-requisitos para desenvolvimento de aplicativos personalizados para equipes
1. Acesso de administrador do Microsoft 365 (produção) ou ingresso no programa de desenvolvedor do Microsoft 365 (desenvolvimento)
2. Acesso do proprietário da assinatura do Azure (Produção) ou Inscreva-se em uma assinatura gratuita do Azure (Dev)
3. Registro Azure OpenAI para sua assinatura Azure
4. Visual Studio/Código do Visual Studio
5. Kit de ferramentas para equipes
6. Capacidades de programação C# ou Javascript
[Mais pré-requisitos em detalhes](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/tools-prerequisites)

## Programa para desenvolvedores do Microsoft 365
- Você precisa ter permissão de administrador do Microsoft Teams para publicar seu aplicativo personalizado no Teams. Caso contrário, tente aplicar um sandbox M365 ingressando no [Microsoft 365 Developer Program](https://developer.microsoft.com/en-us/microsoft-365/dev-program)
- Você receberá um locatário sandbox M365 gratuito com uma assinatura E5 por 90 dias, que pode ser renovada. Se o email com o qual você se registrou tiver uma assinatura do Visual Studio Pro ou Enterprise, não haverá data de expiração.
- Após a criação do locatário do sandbox, clique em [go to myDashboard](https://developer.microsoft.com/en-us/microsoft-365/profile), você encontrará as informações do seu perfil lá. Clique em [ir para assinatura](https://www.office.com) para redirecioná-lo ao site do escritório.
- Clique no ícone ADMIN para acessar o [portal de administração do M365](https://admin.microsoft.com/Adminportal/Home?source=applauncher#/homepage).
![m365admin](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/teamsgpt-join365devpng1.png)
- Em breve voltaremos aqui para aprovar seu aplicativo personalizado pendente no menu esquerdo, Teams Apps > Gerenciar aplicativos
  
## Assinatura Gratuita do Azure
- Comece com 12 meses de serviços gratuitos, mais de 40 serviços sempre gratuitos e US$ 200 em crédito. Crie sua conta gratuita hoje com o Microsoft Azure. [Comece gratuitamente](https://azure.microsoft.com/en-us/free/)
- Se você quiser executar este tutorial sem problemas, evite gastar muito tempo solucionando problemas, [recomenda-se uma conta gratuita](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/tools-prerequisites# conta do Azure)

## Registro do Azure OpenAI (AOAI)
- Para aceder ao ponto final do modelo ChatGPT da AOAI e implementar um recurso AOAI para a sua aplicação personalizada, a sua subscrição do Azure deve ser aprovada.
- O Azure OpenAI exige registro e atualmente está disponível apenas para **clientes empresariais e parceiros** aprovados. Os clientes que desejam usar o Azure OpenAI devem enviar um [formulário de registro](https://aka.ms/oai/access)
- [Processo de registro do Azure OpenAI](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/limited-access#registration-process)

*Dicas: você pode acelerar o processo de inscrição usando a assinatura do Azure sob contrato empresarial. O Serviço de Aplicativo implantado com sua assinatura gratuita do Azure pode enviar a API AOAI para os recursos AOAI concedidos que foram implantados com sua assinatura corporativa do Azure.*

## Componentes do TeamsGPT
![componentes](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/teamsgpt-components.png)

## Instale a versão 5.0 do Teams Toolkit
- Você pode usar seu Dev IDE favorito, como Visual Studio Code ou Visual Studio. Ambos oferecem suporte ao Teams Toolkit. Se você preferir programação Javascipt, opte por VSC enquanto C# para VS. Confira aqui os guias de instalação correspondentes
   - [Código do Visual Studio/Typescript](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/install-teams-toolkit?tabs=vscode&pivots=visual-studio-code#install-teams-toolkit -para-estúdio visual)
   - [Visual Studio / C#](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/install-teams-toolkit?tabs=vscode&pivots=visual-studio#install-teams-toolkit-for- estúdio visual)
- este repo\bot-sso usa a versão de lançamento do Teams Toolkit v5.0 *(~maio de 2023)*

*Dicas: Javascript é preferido como biblioteca de API AOAI disponível apenas com Python (visualização) e com Node.js ([da comunidade Github](https://github.com/1openwindow/azure-openai-node)) neste momento ( ~março de 2023)*

## Pré-requisitos para criar seu aplicativo Teams
1. Instale as ferramentas necessárias para criar seu aplicativo Teams
2. Prepare contas para criar seu aplicativo Teams
3. Permissão de carregamento lateral
4. Verifique a permissão de sideload

- [Prepare todos os pré-requisitos](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/tools-prerequisites)

## Crie um novo projeto do Teams e comece a depurar no ambiente local
1. No VSC, clique no ícone Teams Toolkit no menu esquerdo, selecione "Criar um novo aplicativo" > "Iniciar a partir de uma amostra"
2. Escolha **"Bot App com SSO ativado"** como seu projeto modelo e atribua um novo caminho de pasta
![ssosample](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/teamsgpt-dev-createnewapp.png)
3. Faça login nas contas M365 e Azure
![singinkit](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/signin_teamstoolkit.png)
- Se nenhuma assinatura do Azure for encontrada após a assinatura bem-sucedida, tente editar o teamapp.yml, preencha seu *AZURE_SUBSCRIPTION_ID* e *AZURE_RESOURCE_GROUP_NAME* direcionado e, em seguida, tente entrar e sair algumas vezes ou reinicie o VSC .
##### {pasta do projeto}\bot-sso\teamsapp.yml
```javascript
     {
         com:
             subscriptionId: ${{AZURE_SUBSCRIPTION_ID}} # O AZURE_SUBSCRIPTION_ID é uma variável de ambiente integrada. TeamsFx solicitará que você selecione uma assinatura se seu valor estiver vazio. Você pode fazer referência a outras variáveis de ambiente aqui, mas o TeamsFx não solicitará que você selecione a assinatura se estiver vazia neste caso.
             resourceGroupName: ${{AZURE_RESOURCE_GROUP_NAME}} # O AZURE_RESOURCE_GROUP_NAME é uma variável de ambiente integrada. TeamsFx solicitará que você selecione ou crie um grupo de recursos se seu valor estiver vazio. Você pode fazer referência a outras variáveis de ambiente aqui, mas o TeamsFx não solicitará que você selecione ou crie um grupo de recursos se estiver vazio neste caso.
     }
```
4. Após a criação do projeto, pressione F5 para depurar e iniciar este aplicativo personalizado sem nenhuma alteração de código.
5. O pipeline de depuração invocará seu navegador (Edge/Chrome) e você precisará fazer login com sua conta de usuário sandbox como "xxxx@yyyyyyy.onmicrosoft.com".
6. Uma tela modal será solicitada solicitando que você instale seu aplicativo personalizado como "xxxxxxxxxx-local-debug"
![modo de depuração](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/teamsgpt-dev-01.png)
7. No chat das equipes, você pode tentar enviar “bem-vindo”, “aprender” para o bot. Isso invocará a lógica pré-construída do AdaptiveCards.
- Confira aqui para obter mais detalhes, [Projetando cartões adaptáveis para seu aplicativo Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/design -cartões eficazes?tabs=design)
![acard](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/adaptivecards.jpg)
8. No momento, se tudo estiver no caminho certo, pare o depurador para evitar qualquer interrupção durante a implantação do aplicativo.

## Noções básicas sobre o ciclo de vida de depuração do ambiente local do Teams Toolkit
- Para entender mais sobre o ciclo de vida de depuração, consulte [Depurando o aplicativo Microsoft Teams localmente com o Teams Toolkit](https://devblogs.microsoft.com/microsoft365dev/debugging-microsoft-teams-app-locally-with-teams-toolkit /)

![tk5](https://user-images.githubusercontent.com/103554011/218403711-68502280-228d-43e5-afa1-e6d0c01712e5.png)

## Referências de aprendizagem do Teams Toolkit
- [Como adicionar configurações de aplicativo ao bot/extensão de mensagem hospedada no Azure Web App](https://github.com/OfficeDev/TeamsFx/wiki/Add-app-settings#add-app-settings-to-bot-- extensão de mensagens hospedada pelo aplicativo web do Azure)
- [Como adicionar configurações de aplicativo à API hospedada no Azure Functions](https://github.com/OfficeDev/TeamsFx/wiki/Add-app-settings#add-app-settings-to-api-hosted-by-azure -funções)
- [Como adicionar configurações de aplicativos para depuração local](https://github.com/OfficeDev/TeamsFx/wiki/Add-app-settings#add-app-setting-for-local-debugging)
- [Como encontrar configurações de aplicativos predefinidas pelo Teams Toolkit](https://github.com/OfficeDev/TeamsFx/wiki/Add-app-settings#app-settings-predefined-by-teams-toolkit)
- [Entenda como o Teams Toolkit lida com a configuração do aplicativo para você](https://github.com/OfficeDev/TeamsFx/wiki/Add-app-settings#how-teams-toolkit-handles-app-setting-for-you)

## Implantar na nuvem do Azure
- Provisionar e implantar seu aplicativo personalizado no Azure é algo muito fácil. O kit de ferramentas do Teams fará todas as coisas complicadas para você, o que você precisa fazer

![tkmenu](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/teamsgpt-teamstoolkit.png)
1. Clique no menu Teams toolkit > Implantação > Provisionamento na nuvem e seja paciente. Um prompt será exibido solicitando a região do Azure e o nome do ResourceGroup. Fique com as [regiões suportadas pela AOAI](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/overview#features-overview), como EastUS.
2. Clique no menu Teams toolkit> Implantação > Implantar na nuvem e seja paciente.
3. Clique no menu Teams toolkit> Deployment > Publish to Teams, um prompt será exibido solicitando que você "envie seu aplicativo para o administrador do Teams". ou "envie-o manualmente ao administrador do Teams". Escolheremos "Instalar para sua organização" por conveniência.
![askpublish](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/teamsgpt-askpublish.png)

## Aprovando o aplicativo personalizado pendente
1. Acesse o [Centro de administração do Teams](https://admin.teams.microsoft.com/policies/manage-apps)
2. Menu esquerdo > Aplicativos do Teams > Gerenciar aplicativos
3. Na listagem da grade, coloque o nome do seu aplicativo como "SSOBotSample" na caixa de texto "Pesquisar por nome".
4. Clique na página mestra do seu aplicativo e aprove a solicitação de aplicativo pendente.
![publish1st](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/teamsgpt-publish.png)

## Teste: você e o bot TeamsGPT
- Tente interagir com o bot TeamsGPT do aplicativo personalizado adicionado.
1. Equipes > Aplicativos > Criados para sua organização > clique em seu aplicativo personalizado.
![addapp1](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/teamsgpt-builtforyourorg.png)
2. Na página mestra do aplicativo, clique em "Adicionar".
![addapp2](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/teamsgpt-addapptome.png)
3. Você também pode adicionar seu aplicativo personalizado no menu esquerdo.
![addapp3](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/teamsgpt-selectcustomapp.png)
4. Qualquer mensagem nesta janela de chat 1:1 será entregue ao seu bot sem @menção, tente enviar uma mensagem de boas-vindas.

*Dicas: Adicionar aplicativos" não está disponível para a função de usuário Convidado, [confira](https://support.microsoft.com/en-us/office/team-owner-member-and-guest-capabilities-in- equipes-d03fdf5b-1a6e-48e4-8e07-b13e1350ec7b)*

## Teste: testador, você e o bot TeamsGPT
- Configuraremos um bot TeamsGPT na janela de conversação com outras pessoas.
1. Vá para [Centro de administração do M365](https://admin.microsoft.com/Adminportal/Home?#/users) > Usuários > Usuários ativos >
2. Escolha um usuário predefinido como testador, redefina a senha, desative outro Teams (navegador) e faça login com esta conta de testador.
3. Faça um bate-papo cumprimentando seu testador para iniciar uma nova janela de bate-papo.
4. Equipes > Aplicativos > Criados para sua organização > clique em seu aplicativo personalizado
![addtochat2](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/teamsgpt-addto Whichchat.png)
5. Na página mestra do aplicativo, clique na seta para baixo para expor mais opções. Experimente "Adicionar a um chat", selecione o chat com seu testador
6. Use a menção @{yourcustomappname} para conversar com seu bot
![addtochat3](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/teamsgpt-dev-addbotinchat.png)


## Revise os recursos provisionados do Azure
- O kit de ferramentas do Teams nos ajuda a CI/CD de nosso aplicativo personalizado para a nuvem Azure. Vamos verificar quais recursos foram implantados.
1. Faça login no [Portal do Azure](https://portal.azure.com/) com sua conta gratuita.
2. Localize o grupo de recursos nomeado.
![azureres](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/v5resourcegroup.png)
3. Três recursos foram provisionados para dar suporte à carga de trabalho do seu aplicativo personalizado.
    - Serviço Azure Bot: esta é a infraestrutura subjacente usada para dar suporte à estrutura do Bot integrada ao seu aplicativo personalizado.
    - Plano de Serviço de Aplicativo: Esta é a infraestrutura subjacente usada para dar suporte ao seu Serviço de Aplicativo.
    - Serviço de aplicativo: esta é uma instância lógica do aplicativo para oferecer suporte à lógica do seu aplicativo personalizado.
4. Posteriormente, voltaremos ao App Service para adicionar alguns parâmetros de aplicativo para AOAI.

## Implantar recursos AOAI ChatGPT nos Serviços Cognitivos do Azure
1. Siga esta [diretriz](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal) para implantar um GPT- Recurso 35-Turbo. Manter a mesma região de implantação com o Serviço de Aplicativo implantado pode economizar o custo do tráfego entre regiões.
2. Após a criação da instância, siga esta [diretriz](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/chatgpt-quickstart?tabs=command-line&pivots=programming-language-python #retrieve-key-and-endpoint) para copiar
    - CHAVE
    - Ponto final
    - o nome do modelo que você digitou (não o nome do modelo exibido para seleção)
3. Experimente o [playground de chat](https://oai.azure.com/portal/chat) para entender o conceito de como interagir com o modelo ChatGPT.

## Modifique seu aplicativo personalizado para enviar API AOAI para recursos ChatGPT
- Em primeiro lugar, Python é a única biblioteca AOAI suportada com acordo PREVIEW neste momento (~março de 2023). Como seu aplicativo personalizado é inicializado pelo modelo de projeto do kit de ferramentas do Teams escrito em Javascript. Você pode aproveitar a versão node.js da biblioteca de API AOAI que foi bifurcada pela comunidade aqui [azure-openai-node](https://github.com/1openwindow/azure-openai-node)
1. Instale a biblioteca neste caminho *{projectfolder}\bot-sso\*
```javascript
npm instalar azure-openai -save
```
2. Modificar a versão do seu aplicativo personalizado é muito importante porque a nova versão do aplicativo personalizado leva algum tempo (cerca de algumas horas) para ser refletida para o usuário do Teams no fluxo de trabalho de publicação do aplicativo Teams. Uma prática de versionamento incremental é recomendada para deixar as coisas claras. Tente incrementar a "versão":"1.0.0" para 1.0.1,
##### {pasta do projeto}\bot-sso\appPackage\manifest.json
```javascript
     "versão": "1.0.1",
```
*Dicas: se você quiser alterar o nome do aplicativo personalizado*
```javascript
     "nome": {
         "short": "seucustomappname-${{TEAMSFX_ENV}}",
         "full": "nome completo do nome do seu aplicativo personalizado"
     },
     "descrição": {
         "short": "breve descrição para seu nome de aplicativo personalizado",
         "full": "descrição completa para seu nome de aplicativo personalizado"
     },
```
*Dicas: se você quiser alterar o nome do bot mostrado na mensagem do balão das equipes, vá para Azure > Serviço de bot do Azure > perfil do bot > Nome para exibição*

3. Substitua seu teamBot.ts por este [teamsBot.ts](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/bot-sso/teamsBot.ts) neste repo:main. Este teamBot.ts revisado adicionou uma chamada de API assíncrona ao recurso AOAI no manipulador OnMessage.
##### {pasta do projeto}\bot-sso\teamsBot.ts
```javascript
importar {Configuração, OpenAIApi, ChatCompletionRequestMessageRoleEnum} de "azure-openai";
```
```javascript

     this.openAiApi = novo OpenAIApi(
       nova configuração({
          apiKey: process.env.AOAI_APIKEY,
          //adiciona informações do Azure na configuração
          azul: {
             apiKey: process.env.AOAI_APIKEY,
             ponto final: process.env.AOAI_ENDPOINT,
             // DeploymentName é opcional, se você não definir, será necessário configurá-lo no parâmetro de solicitação
             nome de implementação: process.env.AOAI_MODEL,
          }
       }),
     );

  
     this.onMessage(async (contexto, próximo) => {
       console.log("Executando com atividade de mensagem.");

       deixe txt = contexto.atividade.text;
       //remove a menção deste bot
       const removidoMentionText = TurnContext.removeRecipientMention(
         contexto.atividade
       );
       if (removedMentionText) {
         //Remove a quebra de linha
         txt = removidoMentionText.toLowerCase().replace(/\n|\r/g, "").trim();
       }

       deixe revisadoprompt = [{role:ChatCompletionRequestMessageRoleEnum.System,content:process.env.CHATGPT_SYSTEMCONTENT},{role:ChatCompletionRequestMessageRoleEnum.User, content:txt}];
       console.log("solicitação createChatCompletion: " + JSON.stringify(revisedprompt));
       tentar {
         conclusão const = aguarde this.openAiApi.createChatCompletion({
           modelo: process.env.AOAI_MODEL,
           mensagens: prompt revisado,
           temperatura: parseInt(process.env.CHATFPT_TEMPERATURE),
           max_tokens:parseInt(process.env.CHATGPT_MAXTOKEN),
           top_p: parseInt(process.env.CHATGPT_TOPP),
           parar: process.env.CHATGPT_STOPSEQ
         });
         console.log("resposta createChatCompletion: " +complete.data.choices[0].message.content);
         aguarde context.sendActivity(completion.data.choices[0].message.content);
       } pegar (erro) {
         if (erro.resposta) {
           console.log(erro.response.status);
           console.log(error.response.data);
         } outro {
           console.log(erro.mensagem);
         }
       }
         
```
4. Adicione os seguintes parâmetros ambientais em
##### {pasta do projeto}\bot-sso\ .localSettings
```javascript
AOAI_APIKEY={sua CHAVE AOAI}
AOAI_ENDPOINT={seu terminal AOAI}
AOAI_MODEL={nome do modelo implantado do AOAI}
CHATGPT_SYSTEMCONTENT="Você é um assistente de IA que ajuda as pessoas a encontrar informações."
CHATGPT_MAXTOKEN=1000
CHATGPT_TOPP=0,90
CHATGPT_STOPSEQ=
CHTFPT_TEMPERATURE=0,7
```
Se você não vir nenhum arquivo .localSettings, depurar uma vez (F5) gerará automaticamente esse arquivo.

5. Salve tudo, pressione F5 para começar a depurar seu aplicativo personalizado. Neste momento, você descobrirá que seu bot ficou mais inteligente para responder mais do que apenas *'aprender', 'bem-vindo' e 'mostrar'*.
6. Sinta-se à vontade para alterar quaisquer parâmetros ambientais *CHATGPT_XXXXXXX* para testar as diferenças de como o modelo reage.

## Reimplante o aplicativo personalizado atualizado na nuvem
- Usando o Teams Toolkit, é fácil implantar seu aplicativo personalizado atualizado na nuvem. Como alternativa, você pode optar por contentorizar o aplicativo e implantá-lo com outros serviços de contêiner PaaS, como Azure Kubernetes Service, Azure Container Instance e Azure Container App, ou com serviços DevOps como Azure DevOps.
1. Revise o número da versão em *manifest.template.json* e salve-o.
2. Adicione os parâmetros ambientais mencionados acima em Serviço de Aplicativo > Configuração > Configurações do aplicativo > Nova configuração do aplicativo e salve-o.
![appparameter](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/appserviceparam.png)
3. VSC: clique no menu Teams toolkit > Deployment > Deploy to the cloud e seja paciente.
4. VSC: clique no menu do kit de ferramentas do Teams > Implantação > Publicar no Teams > "Instalar para sua organização".
5. Volte para realizar o fluxo de trabalho acima. **Aprovar o aplicativo personalizado pendente**
![publishupdate1](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/teamsgpt-publishupdate.png)
6. Seu aplicativo personalizado também pode ser adicionado ao canal de qualquer equipe
![publishupdate2](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/teamsgpt-addtochannel.png)

## Arquitetura Referenciada para Plataforma de Produção
![refarch](https://github.com/STI-CNI/CHAT-TEAMS/blob/main/screenshots/refarch.png)
- Se a sua Prova de Conceito/Ponto de Valor funcionar bem, pode ser uma boa ideia configurar uma plataforma de produção para implantação de serviços. Aqui está a arquitetura de referência.
   - **Proteção de Ponto Final Público:** O cliente Teams envia mensagens pela Internet pública para o seu Serviço de Aplicativo. Utilizar FrontDoor ou Application Gateway com Web Application Firewall pode fornecer um alto SLA ao seu serviço, protegendo-o contra ataques DDoS. [Proteção de rede DDoS com arquitetura de aplicativo Web PaaS](https://learn.microsoft.com/en-us/azure/ddos-protection/ddos-protection-reference-architectures#ddos-network-protection-with-paas-web -arquitetura de aplicação)
   - **Controle de aceleração:** Imagine o que aconteceria se seus usuários se tornassem viciados neste serviço. Para proteger seus recursos de back-end contra atividades de spam, o API Management oferece uma [política de limites de taxa e cotas](https://learn.microsoft.com/en-us/azure/api-management/api-management-sample-flexible-throttling #taxa-limites-e-cotas).
   - **Sessão de bate-papo:** todas as mensagens enviadas do cliente Teams são sem estado, assim como a API do modelo ChatGPT. O SDK da estrutura de bot oferece gerenciamento de estado para dar suporte a um fluxo de conversa com estado. Como alternativa, usar o Cache Redis do Azure para implementação traz mais viabilidade e pontos de controle à lógica do seu aplicativo personalizado.
   - **Gerenciamento de chaves e segredos:** A CHAVE, o endpoint e o nome do modelo do recurso AOAI não devem ser armazenados em variáveis ambientais, pois esta não é a melhor prática de segurança. Em vez disso, devem ser armazenados no Azure Key Vault para uma melhor gestão do segredo da aplicação.
   - **Censura de consulta confidencial:** o painel de carga de trabalho do aplicativo personalizado pode ser usado para realizar filtragem, alerta, monitoramento e bloqueio de dados confidenciais. AI Content Safety para detectar com precisão conteúdo inseguro ou inadequado e atribuir automaticamente pontuações de gravidade em tempo real. Permita que sua empresa revise e priorize itens sinalizados e tome medidas informadas.
   - **Segurança de rede:** ao usar injeção VNET, App Gateway, APIM, App Service e Redis podem ser protegidos dentro dos limites de uma VNET. Enquanto isso, AI Content Safety, Bot service e AOAI podem aproveitar a integração VNET (privatelink) para garantir maior conformidade de segurança.

## Lista de tarefas de lógica de aplicativo personalizada
- AOAI oferece uma variedade de modelos GPT além do ChatGPT. Com esses modelos, podemos fazer mais do que apenas conversar com um bot - como resumir documentos, gerar descrições de produtos, aproveitando text-davinci-003 e text-embedding-ada-002
- Para aprimorar ainda mais os recursos do aplicativo personalizado, aqui estão algumas recomendações de tarefas.
   - Utilização de Cartões Adaptáveis (Teams Toolkit) para adicionar um botão para regenerar a pergunta do usuário com diferentes parâmetros do modelo.
   - Além de usar o Redis para implementar uma conversa com estado, considere adotar o recurso pronto para uso fornecido pelo [Bot Framework SDK](https://learn.microsoft.com/en-us/azure/bot-service/bot -builder-basics?view=azure-bot-service-4.0) que dá suporte ao fluxo de conversa complexo com estado.
![estado](https://learn.microsoft.com/en-us/azure/bot-service/v4sdk/media/bot-builder-state.png)
   - Adicionar conjunto de comandos para permitir que o usuário avançado
     - enviar consulta com parâmetros de modelo especificados como: máx. símbolo, temperatura
     - resumindo a geração de documento ou texto (*text-davinci-003*)
     - classificar e traduzir o texto (*text-embedding-ada-002*)
   
## Referências
- [Publicar aplicativos do Teams usando o Teams Toolkit](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/publish)
- [Comece a criar e implantar aplicativos personalizados para Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/teams-toolkit-fundamentals?pivots=visual-studio-code)
- [Recursos de aplicativos e ferramentas de desenvolvimento do Teams](https://learn.microsoft.com/en-us/microsoftteams/platform/get-started/get-started-overview#app-capabilities-and-development-tools)
- [Trabalhando com os modelos ChatGPT e GPT-4 (pré-visualização)](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/chatgpt?pivots=programming-language- conclusões de bate-papo)
- [Kit de ferramentas do Teams para Visual Studio Code 5 agora disponível](https://devblogs.microsoft.com/microsoft365dev/teams-toolkit-for-visual-studio-code-v5-0-now-available/)
- [Wiki do kit de ferramentas do Teams](https://github.com/OfficeDev/TeamsFx/wiki)
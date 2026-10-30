import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  
} from '@angular/fire/auth';

import {
Firestore,
collection,
collectionData,
query,
where,
doc,
getDoc,
updateDoc,
addDoc,
serverTimestamp,
orderBy,
limit
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { OrdemServico as Os } from '../models/index';

import { Maquina } from '../models/index';


@Injectable({
  providedIn: 'root'
})

export class FirebaseService {


    private firestore = inject(Firestore);

   private auth = inject(Auth);



  user$ = authState(this.auth);

  listarMinhasOS(uid:string){

  const ref = collection(this.firestore,'ordens_servico');

  const q = query(
      ref,
      where('uid','==',uid)
  );

  return collectionData(
      q,
      { idField:'protocolo' }
  ) as Observable<Os[]>;

}

getMaquina():Observable<Maquina[]>{

const ref=collection(this.firestore,'maquina');

const q=query(
ref,
orderBy('local'),
limit(10)
);

return collectionData(
q,
{idField:'id'}
) as Observable<Maquina[]>;

}

listarUltimasOrdens():Observable<Os[]>{

const ref=collection(this.firestore,'ordens_servico');

const q=query(
ref,
orderBy('dataAbertura','desc'),
limit(10)
);

return collectionData(
q,
{idField:'protocolo'}
) as Observable<Os[]>;

}

async buscarPorProtocolo(protocolo:string){

const ref=doc(
this.firestore,
'ordens_servico',
protocolo
);

const snap=await getDoc(ref);

if(!snap.exists()) return null;

return{

protocolo:snap.id,

...(snap.data() as Os)

};

}

async criarOS(os: Os): Promise<{ protocolo: string; mensagem: string }> {

  const dados = {
    ...os,
    status: 'pendente',
    dataAbertura: serverTimestamp()
  };

  const ref = collection(this.firestore, 'ordens_servico');

  const docRef = await addDoc(ref, dados);

  os.protocolo = docRef.id;

  const mensagem = this.gerarMensagem(os);

  await this.salvarMensagem(mensagem, docRef.id);

  return {
    protocolo: docRef.id,
    mensagem
  };
}
async atualizarStatus(

protocolo:string,

status:'pendente'|'em andamento'|'concluída',

uid:string

){

const ref=doc(

this.firestore,

'ordens_servico',

protocolo

);

await updateDoc(ref,{

status,

ultimaAtualizacao:serverTimestamp(),

atualizadoPor:uid

});

}

private gerarMensagem(os: Os) {
  const horaInicio = os.dataAbertura ? os.dataAbertura.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';
  const horaFim = os.dataFechamento || '';
  const ultimaAtualizacao = os.atualizadoPor ? os.atualizadoPor.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

  return `🚨 NOVA ORDEM DE SERVIÇO

📋 Protocolo: ${os.protocolo}

📍 Local:
${os.setor}

⚙ Natureza:
${os.natureza}

🚨 Urgência:
${os.prioridade}

📝 ${os.descricao}

Data de Abertura:
${ultimaAtualizacao}

Hora de Início:
${horaInicio}

Hora de Término:
${horaFim}`;
}

private async salvarMensagem(

mensagem:string,

protocolo:string

){

const ref=collection(

this.firestore,

'messages'

);

await addDoc(ref,{

protocolo,

body:mensagem,

to:'5531999184578',

enviado:false,

dataCriacao:serverTimestamp()

});

}



  login(email: string, password: string) {
    return signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
  }

  loginGoogle() {
    return signInWithPopup(
      this.auth,
      new GoogleAuthProvider()
    );
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(
      this.auth,
      email
    );
  }
  getCurrentUser() {
    return this.auth.currentUser;
  }

  logout() {
    return signOut(this.auth);
  }

}


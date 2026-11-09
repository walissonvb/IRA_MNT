import { Injectable, Injector, inject } from '@angular/core';
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
  limit,
  deleteDoc
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { OrdemServico as Os } from '../models/index';

import { Maquina, TecnicaPreditiva, Equipe, RotaStop } from '../models/index';

import { Rota } from '../models/index';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {


  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private injector = inject(Injector);

  user$ = authState(this.auth);

  getTecnicas(): Observable<TecnicaPreditiva[]> {

    const ref = collection(
      this.firestore,
      'tecnicapreditiva'
    );

    return collectionData(
      ref,
      { idField: 'id' }
    ) as Observable<TecnicaPreditiva[]>;

  }

  async salvarRota(
    rota: Partial<Rota>
  ): Promise<string> {

    const ref = collection(
      this.firestore,
      'rota'
    );

    const docRef = await addDoc(
      ref,
      {
        ...rota,
        criadoEm: serverTimestamp(),
        status: 'planejada'
      }
    );

    return docRef.id;
  }

  getEquipes(): Observable<Equipe[]> {

    const ref = collection(
      this.firestore,
      'equipe'
    );

    return collectionData(
      ref,
      { idField: 'id' }
    ) as Observable<Equipe[]>;

  }

  async getRota(id: string): Promise<Rota | null> {

    const ref = doc(
      this.firestore,
      'rota',
      id
    );

    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return null;
    }

    return {
      ...(snap.data() as Rota),
      id: snap.id
    };

  }

getRotas(): Observable<Rota[]> {

  const ref = collection(
    this.firestore,
    'rota'
  );

  return collectionData(
    ref,
    { idField: 'id' }
  ) as Observable<Rota[]>;

}

  listarMinhasOS(uid: string) {

    const ref = collection(this.firestore, 'ordens_servico');

    const q = query(
      ref,
      where('uid', '==', uid)
    );

    return collectionData(
      q,
      { idField: 'protocolo' }
    ) as Observable<Os[]>;

  }

  getMaquina(): Observable<Maquina[]> {

    const ref = collection(this.firestore, 'maquina');

    return (collectionData(
      ref,
      { idField: 'id' }
    ) as Observable<Maquina[]>).pipe(

      tap((docs) =>
        console.log('[getMaquina] docs:', docs.length)
      ),

      catchError((err) => {
        console.error('[getMaquina] erro:', err);
        return of([] as Maquina[]);
      })

    );
  }
  listarUltimasOrdens(): Observable<Os[]> {

    const ref = collection(this.firestore, 'ordens_servico');

    const q = query(
      ref,
      orderBy('dataAbertura', 'desc'),
      limit(10)
    );

    return collectionData(
      q,
      { idField: 'protocolo' }
    ) as Observable<Os[]>;

  }

  async buscarPorProtocolo(protocolo: string) {

    const ref = doc(
      this.firestore,
      'ordens_servico',
      protocolo
    );

    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {

      protocolo: snap.id,

      ...(snap.data() as Os)

    };

  }

  async criarOS(os: Os) {


  }
  async atualizarStatus(

    protocolo: string,

    status: 'pendente' | 'em andamento' | 'concluída',

    uid: string

  ) {

    const ref = doc(

      this.firestore,

      'ordens_servico',

      protocolo

    );

    await updateDoc(ref, {

      status,

      ultimaAtualizacao: serverTimestamp(),

      atualizadoPor: uid

    });

  }

  private gerarMensagem() {

  }

  private async salvarMensagem(

    mensagem: string,

    protocolo: string

  ) {

    const ref = collection(

      this.firestore,

      'messages'

    );

    await addDoc(ref, {

      protocolo,

      body: mensagem,

      to: '5531999184578',

      enviado: false,

      dataCriacao: serverTimestamp()

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


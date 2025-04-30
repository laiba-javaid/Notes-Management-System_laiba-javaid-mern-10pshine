const chai = require('chai');
const sinon = require('sinon');
const Note = require('../../models/note.model');
const noteService = require('../../services/note.service');

const expect = chai.expect;

describe('Note Service', () => {
  afterEach(() => sinon.restore());

  describe('addNote', () => {
    it('should throw if title or content is missing', async () => {
      try {
        await noteService.addNote({ userId: 'u1' });
      } catch (err) {
        expect(err.message).to.equal('Title and content are required');
      }
    });

    it('should create and return a note', async () => {
      const fakeNote = { _id: 'n1', title: 'Test', content: 'Content' };
      sinon.stub(Note, 'create').resolves(fakeNote);

      const result = await noteService.addNote({
        userId: 'u1',
        title: 'Test',
        content: 'Content',
      });

      expect(result).to.eql(fakeNote);
    });
  });

  describe('editNote', () => {
    it('should throw if no changes provided', async () => {
      try {
        await noteService.editNote({ userId: 'u1', noteId: 'n1' });
      } catch (err) {
        expect(err.message).to.equal('At least one field must be provided');
      }
    });

    it('should throw if note not found', async () => {
      sinon.stub(Note, 'findOne').resolves(null);
      try {
        await noteService.editNote({ userId: 'u1', noteId: 'n1', title: 'A' });
      } catch (err) {
        expect(err.message).to.equal('Note not found or unauthorized');
      }
    });

    it('should update and return note', async () => {
      const saveStub = sinon.stub().resolves();
      const fakeNote = { title: '', content: '', tags: [], isPinned: false, save: saveStub };
      sinon.stub(Note, 'findOne').resolves(fakeNote);

      const result = await noteService.editNote({
        userId: 'u1',
        noteId: 'n1',
        title: 'Updated',
      });

      expect(result.title).to.equal('Updated');
    });
  });

  describe('getAllNotes', () => {
    it('should return sorted notes', async () => {
      const fakeNotes = [{ title: 'Note' }];
      sinon.stub(Note, 'find').returns({ sort: sinon.stub().resolves(fakeNotes) });

      const result = await noteService.getAllNotes('u1');
      expect(result).to.eql(fakeNotes);
    });
  });

  describe('deleteNote', () => {
    it('should throw if note not found', async () => {
      sinon.stub(Note, 'findOne').resolves(null);
      try {
        await noteService.deleteNote({ userId: 'u1', noteId: 'n1' });
      } catch (err) {
        expect(err.message).to.equal('Note not found');
      }
    });

    it('should delete note', async () => {
      sinon.stub(Note, 'findOne').resolves({ _id: 'n1' });
      sinon.stub(Note, 'deleteOne').resolves();

      const result = await noteService.deleteNote({ userId: 'u1', noteId: 'n1' });
      expect(result).to.be.true;
    });
  });

  describe('updatePinnedStatus', () => {
    it('should throw if note not found', async () => {
      sinon.stub(Note, 'findOne').resolves(null);
      try {
        await noteService.updatePinnedStatus({ userId: 'u1', noteId: 'n1', isPinned: true });
      } catch (err) {
        expect(err.message).to.equal('Note not found');
      }
    });

    it('should update pin status', async () => {
      const saveStub = sinon.stub().resolves();
      const fakeNote = { isPinned: false, save: saveStub };
      sinon.stub(Note, 'findOne').resolves(fakeNote);

      const result = await noteService.updatePinnedStatus({ userId: 'u1', noteId: 'n1', isPinned: true });
      expect(result.isPinned).to.be.true;
    });
  });

  describe('searchNotes', () => {
    it('should throw if query is missing', async () => {
      try {
        await noteService.searchNotes({ userId: 'u1' });
      } catch (err) {
        expect(err.message).to.equal('Search query is required');
      }
    });

    it('should return matching notes', async () => {
      const fakeResults = [{ title: 'Match' }];
      sinon.stub(Note, 'find').resolves(fakeResults);

      const result = await noteService.searchNotes({ userId: 'u1', query: 'Match' });
      expect(result).to.eql(fakeResults);
    });
  });
});
